import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import fakeFirestore from './fakeFirestore';
import { currentUserActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';
import { syncReady } from 'actions/firestoreActions';
import setup from './partySagas';

describe('partySagas', () => {
  let sagas, fakeFs;

  beforeEach(() => {
    fakeFs = fakeFirestore(jest);
    sagas = setup(fakeFs.db, fakeFs.auth);
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
          expect(fakeFs.collection).not.toHaveBeenCalled();
          expect(fakeFs.partyDocRef.set).not.toHaveBeenCalled();
        });
    });

    describe('when sync is ready', () => {
      let savedParty, newPartyId;
      mockRandomForEach(0.8888);

      beforeEach(() => {
        savedParty = {
          ...initialState.party,
          ...newParty,
          users: ['AUID'],
          queue: [],
        };
        newPartyId = 'party-poopy-8888';
        saga = saga.dispatch(syncReady());
      });

      it('creates new party when ready', () => {
        return saga
          .dispatch(partyActions.newParty(newParty))
          .put(partyActions.newPartySuccess(savedParty, newPartyId))
          .silentRun()
          .then(() => {
            expect(fakeFs.collection).toHaveBeenCalledWith('parties');
            expect(fakeFs.partyDocFunc).toHaveBeenCalledWith(newPartyId);
            expect(fakeFs.partyDocRef.set).toHaveBeenCalledWith(savedParty);
          });
      });

      it('sends error when there is an error', () => {
        const error = Error('something happened');
        fakeFs.partyDocRef.set = jest.fn(() => {
          throw error;
        });
        return saga
          .dispatch(partyActions.newParty(newParty))
          .not.put(partyActions.newPartySuccess(newParty, newPartyId))
          .put(partyActions.newPartyError(error))
          .silentRun()
          .then(() => {
            expect(fakeFs.partyDocRef.set).toHaveBeenCalledWith(savedParty);
          });
      });
    });
  });

  describe('watchNewPartySuccess', () => {
    let initialState, saga, newParty, newPartyId;
    beforeEach(() => {
      initialState = rootReducer({}, {});
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Pedro',
      };
      initialState.firestore.uid = 'PDoA';
      newParty = { name: 'Pedro Penduko Graduation' };
      newPartyId = 'pedro-penduko-1234';
      saga = expectSaga(sagas.watchNewPartySuccess).withReducer(
        rootReducer,
        initialState
      );
    });

    it('assigns new party to user', () => {
      return saga
        .dispatch(partyActions.newPartySuccess(newParty, newPartyId))
        .put(currentUserActions.setParty(newPartyId))
        .silentRun();
    });
  });

  describe('watchGetParty', () => {
    let initialState, saga, party, partyId;
    beforeEach(() => {
      initialState = rootReducer({}, {});
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Pedro',
      };
      initialState.firestore.uid = 'PDoA';
      partyId = 'pedro-penduko-1234';
      saga = expectSaga(sagas.watchGetParty).withReducer(
        rootReducer,
        initialState
      );
    });

    it('loads party when party field of user is set', () => {
      fakeFs.partyData = { name: 'Pedro Penduko', users: ['PDoA'], queue: [] };
      return saga
        .dispatch(partyActions.getParty(partyId))
        .put(partyActions.loadParty(fakeFs.partyData))
        .silentRun()
        .then(() => {
          expect(fakeFs.partyDocFunc).toHaveBeenCalledWith(partyId);
        });
    });
  });
});
