import { expectSaga } from 'redux-saga-test-plan';

import { currentUserActions, errorActions } from '../actions';
import rootReducer from '../reducers/index';

import * as promise from '../helpers/promise';
import {
  signInAnonymouslySuccess,
  signInAnonymouslyError,
  syncReady,
} from '../actions/firestoreActions';
import YtkFire, { UserDataDoesNotExist } from '../YtkFire';

import setup from './sagas';

// TODO: Flaky test
describe.skip('sagas', () => {
  let sagas, ytkFire;

  beforeEach(() => {
    ytkFire = new YtkFire({}, {});
    sagas = setup(ytkFire);
  });

  const fakeUserData = { name: 'John' };
  const fakeUid = 'FAKEUID';
  const fakeAuthResponse = { uid: fakeUid };

  describe('rootSagas', () => {
    beforeEach(() => {
      ytkFire.signInAnonymously = jest.fn(
        promise.fnResolvesTo(fakeAuthResponse)
      );
      ytkFire.retrieveUserData = jest.fn(promise.fnResolvesTo(fakeUserData));
      ytkFire.saveUser = jest.fn();
    });

    test('happy path: revisiting user', async () => {
      const finalState = rootReducer({}, {});
      finalState.currentUser = {
        ...finalState.currentUser,
        ...fakeUserData,
        homeState: 'loaded',
      };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeUid,
      };

      expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .hasFinalState(finalState)
        .put(signInAnonymouslySuccess(fakeAuthResponse))
        .not.put.like(signInAnonymouslyError())
        .silentRun();
    });

    test('happy path: new user', () => {
      ytkFire.retrieveUserData = jest.fn(() => {
        throw new UserDataDoesNotExist(fakeUid);
      });
      const finalState = rootReducer({}, {});
      finalState.currentUser = {
        ...finalState.currentUser,
        homeState: 'loaded',
      };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeUid,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .put(signInAnonymouslySuccess(fakeAuthResponse))
        .hasFinalState(finalState)
        .silentRun();
    });

    test('failed path: error on signIn', () => {
      const error = Error('Something happened while signing in');
      ytkFire.signInAnonymously = jest.fn(promise.fnRejectsWith(error));

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
        .not.call.fn(ytkFire.retrieveUserData)
        .put(signInAnonymouslyError(error))
        .hasFinalState(finalState);
      return saga.silentRun();
    });

    describe('syncUserChanges', () => {
      let initialState, syncSaga;
      beforeEach(() => {
        initialState = rootReducer({}, {});
        initialState.currentUser.name = 'Jane';
        initialState.firestore.uid = 'AUID';
        ytkFire.uid = initialState.firestore.uid;
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
        await syncSaga
          .dispatch(syncReady())
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun()
          .then(() => {
            expect(ytkFire.saveUser).toHaveBeenCalledWith(savedUser);
          });
      });

      it('does nothing while not sync ready', async () => {
        await syncSaga
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun();
        expect(ytkFire.saveUser).not.toHaveBeenCalled();
      });

      it('does nothing when no user change is dispatched', async () => {
        await syncSaga
          .dispatch(syncReady())
          .dispatch(errorActions.setErrorMessage('Something went wrong'))
          .silentRun()
          .then(() => {
            expect(ytkFire.saveUser).not.toHaveBeenCalled();
          });
      });
    });
  });
});
