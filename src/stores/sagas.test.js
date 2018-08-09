import { expectSaga } from 'redux-saga-test-plan';

import fakeFirestore from './fakeFirestore';
import { currentUserActions, errorActions } from 'actions';
import rootReducer from 'reducers/index';

import {
  signInAnonymouslySuccess,
  signInAnonymouslyError,
  syncReady,
} from 'actions/firestoreActions';
import YtkFire from '../YtkFire';

import setup from './sagas';

describe('sagas', () => {
  let sagas, fakeFs, ytkFire;

  beforeEach(() => {
    fakeFs = fakeFirestore(jest);
    ytkFire = new YtkFire(fakeFs.db, fakeFs.auth);
    sagas = setup(ytkFire);
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
        .put(signInAnonymouslySuccess(fakeFs.authResponse))
        .not.put.like(signInAnonymouslyError())
        .silentRun()
        .then(() => {
          expect(fakeFs.auth.signInAnonymously).toHaveBeenCalled();
        });
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
      const promise = () =>
        new Promise(function(resolve, reject) {
          setTimeout(reject, 0, error);
        });

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

      const saga = expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .not.call.fn(fakeFs.userDocRef.get)
        .put(signInAnonymouslyError(error))
        .hasFinalState(finalState);
      fakeFs._set('signInResponse', promise());
      return saga.silentRun();
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

      it('saves user when changes are made', async () => {
        const savedUser = {
          ...initialState.currentUser,
          party: 'party-night-123',
        };
        await ytkFire.signInAnonymously();
        await syncSaga
          .dispatch(syncReady())
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun()
          .then(() => {
            expect(fakeFs.userSetMock).toHaveBeenCalledWith(savedUser);
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

      it('does nothing when no user change is dispatched', async () => {
        await ytkFire.signInAnonymously();
        await syncSaga
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
