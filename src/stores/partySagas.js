import { all, take, takeEvery, put } from 'redux-saga/effects';

import { ActionTypes as types } from '../constants';
import idFromName from 'helpers/idFromName';
import {
  newPartySuccess,
  newPartyError,
  loadParty,
} from 'actions/partyActions';
import { setParty } from 'actions/currentUserActions';
import { getUidFromState } from './sagasCommon';
import { defaultState as defaultParty } from 'reducers/party';

export default function partySagas(db, auth) {
  function* watchNewParty() {
    yield take(types.FIRESTORE_SYNC_READY);
    yield takeEvery(types.PARTY_NEW, newParty);
  }

  function* newParty(action) {
    const party = { ...defaultParty, ...action.data };
    party.users = [yield getUidFromState()];
    try {
      const partiesCollection = db.collection('parties');
      const id = idFromName(party.name);
      yield partiesCollection.doc(id).set(party);
      yield put(newPartySuccess(party, id));
    } catch (error) {
      yield put(newPartyError(error));
    }
  }

  function* watchNewPartySuccess() {
    yield takeEvery(types.PARTY_NEW_SUCCESS, assignParty);
  }

  function* assignParty({ data }) {
    yield put(setParty(data.id));
  }

  function* watchGetParty() {
    yield takeEvery(types.PARTY_GET, announceLoadParty);
  }

  function* announceLoadParty({ data }) {
    const docRef = db.collection('parties').doc(data);
    const response = yield docRef.get();
    yield put(loadParty(response.data()));
  }

  function* allPartySagas() {
    yield all([watchNewParty(), watchNewPartySuccess(), watchGetParty()]);
  }

  return {
    watchNewParty,
    watchNewPartySuccess,
    watchGetParty,
    allPartySagas,
  };
}
