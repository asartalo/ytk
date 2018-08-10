import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import * as promise from 'helpers/promise';
import { currentUserActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';
import { syncReady } from 'actions/firestoreActions';
import setup from './partySagas';
import YtkFire from '../YtkFire';

describe('partySagas', () => {
  let sagas, ytkFire;

  beforeEach(() => {
    ytkFire = new YtkFire({}, {});
    sagas = setup(ytkFire);
  });

  describe('watchNewParty', () => {
    let initialState, saga, newParty;

    beforeEach(() => {
      ytkFire.newParty = jest.fn();
      initialState = rootReducer({}, {});
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Juan',
      };
      ytkFire.uid = initialState.firestore.uid = 'AUID';
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
    beforeEach(async () => {
      initialState = rootReducer({}, {});
      initialState.currentUser = {
        ...initialState.currentUser,
        name: 'Pedro',
      };
      ytkFire.uid = initialState.firestore.uid = 'AUID';
      partyId = 'pedro-penduko-1234';
      saga = expectSaga(sagas.watchGetParty).withReducer(
        rootReducer,
        initialState
      );
    });

    it('loads party when party field of user is set', () => {
      const partyData = { name: 'Pedro Penduko', users: ['PDoA'], queue: [] };
      ytkFire.getParty = jest.fn(() => promise.resolvesTo(partyData));
      return saga
        .dispatch(partyActions.getParty(partyId))
        .put(partyActions.loadParty(partyData))
        .silentRun()
        .then(() => {
          expect(ytkFire.getParty).toHaveBeenCalledWith(partyId);
        });
    });
  });
});
