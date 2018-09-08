import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import * as promise from 'helpers/promise';
import { currentUserActions, partyActions } from 'actions';
import rootReducer from 'reducers/index';
import { syncReady } from 'actions/firestoreActions';
import setup from './partySagas';
import YtkFire from '../YtkFire';
import { party } from 'fixtures/parties';
import queuedVideos from 'fixtures/queuedVideos';
import { defaultParty } from 'fixtures/parties';

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
          users: [{ name: 'Juan', uid: 'AUID' }],
          queue: [],
          id: newPartyId,
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
        const passedParty = { ...savedParty, id: '' };
        expect(ytkFire.newParty).toHaveBeenCalledWith(passedParty);
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
        uid: 'PDoA',
      };
      partyId = 'pedro-penduko-1234';
      saga = expectSaga(sagas.watchGetParty).withReducer(
        rootReducer,
        initialState
      );
    });

    it('loads party when party field of user is set', async () => {
      const partyData = {
        name: 'Pedro Penduko',
        users: [{ name: 'Pedro', uid: 'PDoA' }],
        queue: [],
      };
      ytkFire.getParty = jest.fn(() => promise.resolvesTo(partyData));
      ytkFire.syncParty = jest.fn(() => () => {});
      await saga
        .dispatch(partyActions.getParty(partyId))
        .put(partyActions.loadParty(partyData))
        .silentRun();
      expect(ytkFire.getParty).toHaveBeenCalledWith(partyId);
    });

    it('redirects to join page when user is not a party member', async () => {
      const partyData = {
        name: 'Pedro Penduko',
        users: [{ name: 'Maria', uid: 'Mid' }],
        queue: [],
      };
      ytkFire.getParty = jest.fn(() => promise.resolvesTo(partyData));
      ytkFire.syncParty = jest.fn(() => () => {});
      await saga
        .dispatch(partyActions.getParty(partyId))
        .put(partyActions.notAMember(partyId))
        .not.put(partyActions.loadParty(partyData))
        .silentRun()
        .then(({ storeState }) => {
          expect(storeState.ui.redirectTo).toEqual(`/${partyId}/join`);
        });
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

      it('calls joinParty with user profile', async () => {
        await saga.silentRun();
        expect(ytkFire.joinParty).toHaveBeenCalledWith(partyId, {
          name: 'Jane',
          uid: 'JAID',
        });
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

  describe('watchPartyUpdated()', () => {
    beforeEach(() => {
      initialState.firestore = {
        ...initialState.firestore,
        uid: 'JUID',
      };
      saga = expectSaga(sagas.watchPartyUpdated).withReducer(
        rootReducer,
        initialState
      );
    });

    it('does nothing when party did not change', async () => {
      await saga
        .dispatch(
          partyActions.partyUpdated({
            ...initialState.party,
          })
        )
        .not.put(partyActions.loadParty({ ...initialState.party }))
        .silentRun();
    });

    it('loads party when there is some change', async () => {
      const newParty = {
        ...initialState.party,
        queue: [...queuedVideos.slice(2)],
      };
      await saga
        .dispatch(partyActions.partyUpdated(newParty))
        .put(partyActions.loadParty(newParty))
        .silentRun();
    });
  });
});
