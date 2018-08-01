import { take, takeEvery, put } from 'redux-saga/effects';

import { ActionTypes as types } from '../constants';
import idFromName from 'helpers/idFromName';
import { newPartySuccess, newPartyError } from 'actions/partyActions';

export default function partySagas(db, auth) {
  function* watchNewParty() {
    yield take(types.FIRESTORE_SYNC_READY);
    yield takeEvery(types.PARTY_NEW, newParty);
  }

  function* newParty(action) {
    const party = action.data;
    try {
      const partiesCollection = db.collection('parties');
      const id = idFromName(party.name);
      yield partiesCollection.doc(id).set(party);
      yield put(newPartySuccess(party, id));
    } catch (error) {
      yield put(newPartyError(error));
    }
  }

  return {
    watchNewParty,
  };
}
