import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import * as promise from 'helpers/promise';
import { currentUserActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';
import { syncReady } from 'actions/firestoreActions';
import setup from './partySagas';
import YtkFire from '../YtkFire';

describe('partySagas', () => {
  let initialState, sagas, saga, ytkFire;

  beforeEach(() => {
    ytkFire = new YtkFire({}, {});
    sagas = setup(ytkFire);
    initialState = { ...rootReducer({}, {}) };
  });

  describe('watchNewParty', () => {
    let newParty;

    beforeEach(() => {
      ytkFire.newParty = jest.fn();
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Juan',
      };
      initialState.firestore = {
        ...initialState.firestore,
        uid: 'AUID',
      };
      newParty = { ...initialState.party, name: 'Party Poopy' };
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
          expect(ytkFire.newParty).not.toHaveBeenCalled();
        });
    });

    describe('when sync is ready', () => {
      let savedParty, newPartyId;

      beforeEach(() => {
        newPartyId = 'party-poopy-8888';
        savedParty = {
          ...initialState.party,
          ...newParty,
          users: ['AUID'],
          queue: [],
        };
        ytkFire.newParty.mockImplementation(() =>
          promise.resolvesTo({ id: newPartyId, party: savedParty })
        );
        saga = saga.dispatch(syncReady());
      });

      it('creates new party when ready', async () => {
        await saga
          .dispatch(partyActions.newParty(newParty))
          .put(partyActions.newPartySuccess(savedParty, newPartyId))
          .silentRun();
        expect(ytkFire.newParty).toHaveBeenCalledWith(newParty);
      });

      it('sends error when there is an error', async () => {
        const error = Error('something happened');
        ytkFire.newParty = jest.fn(() => {
          throw error;
        });
        await saga
          .dispatch(partyActions.newParty(newParty))
          .not.put(partyActions.newPartySuccess(newParty, newPartyId))
          .put(partyActions.newPartyError(error))
          .silentRun();
      });
    });
  });

  describe('watchNewPartySuccess', () => {
    let newParty, newPartyId;
    beforeEach(() => {
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Pedro',
      };
      initialState.firestore = {
        ...initialState.firestore,
        uid: 'PDoA',
      };
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
    let party, partyId;
    beforeEach(() => {
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Pedro',
      };
      initialState.firestore = {
        ...initialState.firestore,
        uid: 'AUID',
      };
      partyId = 'pedro-penduko-1234';
      saga = expectSaga(sagas.watchGetParty).withReducer(
        rootReducer,
        initialState
      );
    });

    it('loads party when party field of user is set', async () => {
      const partyData = { name: 'Pedro Penduko', users: ['PDoA'], queue: [] };
      ytkFire.getParty = jest.fn(() => promise.resolvesTo(partyData));
      await saga
        .dispatch(partyActions.getParty(partyId))
        .put(partyActions.loadParty(partyData))
        .silentRun();
      expect(ytkFire.getParty).toHaveBeenCalledWith(partyId);
    });
  });

  describe('watchJoinParty', () => {
    let partyId = 'funky-jane-8989';
    beforeEach(() => {
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Jane',
      };
      ytkFire.joinParty = jest.fn();
      saga = expectSaga(sagas.watchJoinParty)
        .withReducer(rootReducer, initialState)
        .dispatch(partyActions.joinParty(partyId));
    });

    it('does nothing if the user is not signed in', async () => {
      await saga.silentRun();
      expect(ytkFire.joinParty).not.toHaveBeenCalled();
    });

    describe('when user is signed in', () => {
      beforeEach(() => {
        initialState.firestore = {
          ...initialState.firestore,
          uid: 'JAID',
        };
      });

      it('calls joinParty with ID', async () => {
        await saga.silentRun();
        expect(ytkFire.joinParty).toHaveBeenCalledWith(partyId);
      });

      it('sends a partySuccess action on success', async () => {
        await saga.put(partyActions.joinPartySuccess(partyId)).silentRun();
      });

      it('throws error if errored', async () => {
        const error = Error('Something happened');
        ytkFire.joinParty = jest.fn(() => {
          throw error;
        });
        await saga.not
          .put(partyActions.joinPartySuccess(partyId))
          .put(partyActions.joinPartyError(error))
          .silentRun();
      });
    });
  });
});
