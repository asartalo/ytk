import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import { currentUserActions, errorActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';

import {
  signInAnonymouslySuccess,
  signInAnonymouslyError,
  syncReady,
} from 'actions/firestoreActions';

import setup from './sagas';

describe('sagas', () => {
  let sagas, db, auth;
  let fakeAuthUser,
    fakeResponse,
    signInResponse,
    fakeUserData,
    fakePartyData,
    fakeUserDoc,
    fakePartyDoc,
    fakeUserDocResponse,
    fakePartyDocResponse,
    fakePartyDocFunc,
    fakeUserDocRef,
    fakePartyDocRef,
    fakeCollection,
    partySetMock;

  beforeEach(() => {
    fakeAuthUser = { uid: 'FAKEUID' };
    fakeResponse = { user: fakeAuthUser };
    signInResponse = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(fakeResponse);
      }, 0);
    });

    fakeUserData = {
      name: 'John',
      intent: '',
      party: '',
    };

    fakeUserDoc = {
      exists: true,
      data: () => fakeUserData,
    };

    fakeUserDocResponse = () =>
      new Promise(resolve => {
        setTimeout(resolve, 0, fakeUserDoc);
      });

    fakePartyDocResponse = () =>
      new Promise(resolve => {
        setTimeout(resolve, 0, fakePartyDoc);
      });

    let userSetMock = jest.fn();
    userSetMock.mockReturnValue(
      new Promise(resolve => {
        setTimeout(resolve, 0);
      })
    );

    partySetMock = jest.fn();
    partySetMock.mockReturnValue(
      new Promise(resolve => {
        setTimeout(resolve, 0);
      })
    );

    fakeUserDocRef = {
      get: () => fakeUserDocResponse(),
      set: userSetMock,
    };

    fakePartyDocRef = {
      get: () => fakePartyDocResponse(),
      set: partySetMock,
    };

    fakePartyDocFunc = jest.fn(id => fakePartyDocRef);
    fakeCollection = jest.fn(collection => {
      return {
        users: { doc: jest.fn(uid => fakeUserDocRef) },
        parties: { doc: fakePartyDocFunc },
      }[collection];
    });

    db = {
      collection: fakeCollection,
    };
    auth = {
      signInAnonymously: () => signInResponse,
    };
    sagas = setup(db, auth);
  });

  describe('rootSagas', () => {
    test('happy path: revisiting user', () => {
      const finalState = rootReducer({}, {});
      finalState.currentUser = { ...fakeUserData, homeState: 'loaded' };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeAuthUser.uid,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .hasFinalState(finalState)
        .apply(auth, auth.signInAnonymously)
        .put(signInAnonymouslySuccess(fakeResponse))
        .not.put.like(signInAnonymouslyError())
        .silentRun();
    });

    test('happy path: new user', () => {
      fakeUserDoc = { exists: false };
      // fakeUserData = ;
      const finalState = rootReducer({}, {});
      finalState.currentUser = {
        ...finalState.currentUser,
        homeState: 'loaded',
      };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: true,
        userDataLoaded: true,
        uid: fakeAuthUser.uid,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .hasFinalState(finalState)
        .silentRun();
    });

    test('failed path: error on signIn', () => {
      signInResponse = new Promise((_, reject) => {
        setTimeout(reject, 0, Error('Something happened while signing in'));
      });
      const finalState = rootReducer({}, {});
      finalState.currentUser = {
        ...finalState.currentUser,
        homeState: 'loaded',
      };
      finalState.error = {
        ...finalState.error,
        errorMsg: 'Something happened while signing in',
      };
      finalState.firestore = {
        ...finalState.firestore,
        signedIn: false,
        userDataLoaded: false,
      };

      return expectSaga(sagas.rootSaga)
        .withReducer(rootReducer)
        .not.call.fn(fakeUserDocRef.get)
        .hasFinalState(finalState)
        .silentRun();
    });

    describe('syncUserChanges', () => {
      let initialState, syncSaga;
      beforeEach(() => {
        initialState = rootReducer({}, {});
        initialState.currentUser = {
          ...initialState.currentUser,
          name: 'Jane',
        };
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
            expect(fakeUserDocRef.set).toHaveBeenCalledWith(savedUser);
          });
      });

      it('does nothing while not sync ready', () => {
        return syncSaga
          .dispatch(currentUserActions.setParty('party-night-123'))
          .silentRun()
          .then(() => {
            expect(fakeUserDocRef.set).not.toHaveBeenCalled();
          });
      });

      it('does nothing when no user change is dispatched', () => {
        return syncSaga
          .dispatch(syncReady())
          .dispatch(errorActions.setErrorMessage('Something went wrong'))
          .silentRun()
          .then(() => {
            expect(fakeUserDocRef.set).not.toHaveBeenCalled();
          });
      });
    });
  });
});
