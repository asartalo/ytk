import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import { errorActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';

import { syncReady } from 'actions/firestoreActions';
import setup from './partySagas';

describe('partySagas', () => {
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

  describe('watchNewParty', () => {
    let initialState, saga, newParty;
    beforeEach(() => {
      initialState = rootReducer({}, {});
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Juan',
      };
      initialState.firestore.uid = 'AUID';
      newParty = { name: 'Party Poopy' };
      saga = expectSaga(sagas.watchNewParty).withReducer(
        rootReducer,
        initialState
      );
    });

    it('does nothing while not sync ready', () => {
      return saga
        .dispatch(partyActions.newParty(newParty))
        .silentRun()
        .then(() => {
          expect(fakeCollection).not.toHaveBeenCalled();
          expect(fakePartyDocRef.set).not.toHaveBeenCalled();
        });
    });

    describe('when sync is ready', () => {
      let savedParty, newPartyId;
      mockRandomForEach(0.8888);

      beforeEach(() => {
        savedParty = {
          ...initialState.party,
          ...newParty,
        };
        newPartyId = 'party-poopy-8888';
        saga = saga.dispatch(syncReady());
      });

      it('creates new party when ready', () => {
        return saga
          .dispatch(partyActions.newParty(newParty))
          .put(partyActions.newPartySuccess(newParty, newPartyId))
          .silentRun()
          .then(() => {
            expect(fakeCollection).toHaveBeenCalledWith('parties');
            expect(fakePartyDocFunc).toHaveBeenCalledWith(newPartyId);
            expect(fakePartyDocRef.set).toHaveBeenCalledWith(savedParty);
          });
      });

      it('sends error when there is an error', () => {
        const error = Error('something happened');
        fakePartyDocRef.set = jest.fn(() => {
          throw error;
        });
        return saga
          .dispatch(partyActions.newParty(newParty))
          .not.put(partyActions.newPartySuccess(newParty, newPartyId))
          .put(partyActions.newPartyError(error))
          .silentRun()
          .then(() => {
            expect(fakePartyDocRef.set).toHaveBeenCalledWith(savedParty);
          });
      });
    });
  });
});
