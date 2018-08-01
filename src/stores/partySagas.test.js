import { expectSaga } from 'redux-saga-test-plan';
import { mockRandomForEach } from 'jest-mock-random';

import fakeFirestore from './fakeFirestore';
import { partyActions } from 'actions';
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
});
