import { expectSaga } from 'redux-saga-test-plan';

import fakeFirestore from './fakeFirestore';
import { currentUserActions, errorActions } from 'actions';
import rootReducer from 'reducers/index';

import {
  signInAnonymouslySuccess,
  signInAnonymouslyError,
  syncReady,
} from 'actions/firestoreActions';

import setup from './sagas';

describe('sagas', () => {
  let sagas, fakeFs;

  beforeEach(() => {
    fakeFs = fakeFirestore(jest);
    sagas = setup(fakeFs.db, fakeFs.auth);
  });

  describe('rootSagas', () => {
    test('happy path: revisiting user', () => {
      const finalState = rootReducer({}, {});
      finalState.currentUser = { ...fakeFs.userData, homeState: 'loaded' };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeFs.authUser.uid,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .hasFinalState(finalState)
        .apply(fakeFs.auth, fakeFs.auth.signInAnonymously)
        .put(signInAnonymouslySuccess(fakeFs.authResponse))
        .not.put.like(signInAnonymouslyError())
        .silentRun();
    });

    test('happy path: new user', () => {
      fakeFs.userDoc = { exists: false };
      // fakeFs.userData = ;
      const finalState = rootReducer({}, {});
      finalState.currentUser = {
        ...finalState.currentUser,
        homeState: 'loaded',
      };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeFs.authUser.uid,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .put(signInAnonymouslySuccess(fakeFs.authResponse))
        .hasFinalState(finalState)
        .silentRun();
    });

    test('failed path: error on signIn', () => {
      const error = Error('Something happened while signing in');
      const promise = new Promise(function(resolve, reject) {
        setTimeout(reject, 10, error);
      });

      fakeFs._set('signInResponse', promise);
      let finalState = rootReducer({}, {});
      finalState = {
        ...finalState,
        currentUser: {
          ...finalState.currentUser,
          homeState: 'loaded',
        },
        error: {
          ...finalState.error,
          errorMsg: 'Something happened while signing in',
        },
        firestore: {
          ...finalState.firestore,
          signedIn: false,
          userDataLoaded: false,
        },
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .not.call.fn(fakeFs.userDocRef.get)
        .put(signInAnonymouslyError(error))
        .hasFinalState(finalState)
        .silentRun();
    });

    describe('syncUserChanges', () => {
      let initialState, syncSaga;
      beforeEach(() => {
        initialState = rootReducer({}, {});
        initialState.currentUser.name = 'Jane';
        initialState.firestore.uid = 'AUID';
        syncSaga = expectSaga(sagas.syncUserChanges).withReducer(
          rootReducer,
          initialState
        );
      });

      it('saves user when changes are made', () => {
        const savedUser = {
          ...initialState.currentUser,
          party: 'party-night-123',
        };
        return syncSaga
          .dispatch(syncReady())
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun()
          .then(() => {
            expect(fakeFs.userDocRef.set).toHaveBeenCalledWith(savedUser);
          });
      });

      it('does nothing while not sync ready', () => {
        return syncSaga
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun()
          .then(() => {
            expect(fakeFs.userDocRef.set).not.toHaveBeenCalled();
          });
      });

      it('does nothing when no user change is dispatched', () => {
        return syncSaga
          .dispatch(syncReady())
          .dispatch(errorActions.setErrorMessage('Something went wrong'))
          .silentRun()
          .then(() => {
            expect(fakeFs.userDocRef.set).not.toHaveBeenCalled();
          });
      });
    });
  });
});
