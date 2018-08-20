import { all, put, take, takeEvery, takeLatest } from 'redux-saga/effects';

import { ActionTypes as types } from '../constants';
import * as partyActions from 'actions/partyActions';
import { setParty } from 'actions/currentUserActions';
import { continueIfSignedIn, getUserAndUidFromState } from './sagasCommon';
import { defaultState as defaultParty } from 'reducers/party';

export default function partySagas(ytkFire) {
  function* watchNewParty() {
    yield take(types.FIRESTORE_SYNC_READY);
    yield takeEvery(types.PARTY_NEW, newParty);
  }

  function* newParty(action) {
    const { currentUser, uid } = yield getUserAndUidFromState();
    let newPartyData = {
      ...defaultParty,
      ...action.data,
      users: [{ name: currentUser.name, uid: uid }],
    };
    try {
      let { party, id } = yield ytkFire.newParty(newPartyData);
      yield put(partyActions.newPartySuccess(party, id));
    } catch (error) {
      yield put(partyActions.newPartyError(error));
    }
  }

  function* watchNewPartySuccess() {
    yield takeEvery(types.PARTY_NEW_SUCCESS, announceNewParty);
  }

  function* announceNewParty({ data }) {
    yield put(setParty(data.id));
  }

  function* watchGetParty() {
    yield takeLatest(types.PARTY_GET, announceLoadParty);
  }

  function* announceLoadParty({ data }) {
    yield* continueIfSignedIn();
    const party = yield ytkFire.getParty(data);
    yield put(partyActions.loadParty(party));
  }

  function* allPartySagas() {
    yield all([
      watchNewParty(),
      watchNewPartySuccess(),
      watchGetParty(),
      watchJoinParty(),
    ]);
  }

  function* watchJoinParty() {
    yield takeEvery(types.PARTY_JOIN, joinParty);
  }

  function* joinParty(action) {
    yield* continueIfSignedIn();
    const partyId = action.data;
    const { currentUser, uid } = yield getUserAndUidFromState();
    try {
      yield ytkFire.joinParty(partyId, { name: currentUser.name, uid });
      yield put(partyActions.joinPartySuccess(partyId));
    } catch (error) {
      yield put(partyActions.joinPartyError(error));
    }
  }

  return {
    watchNewParty,
    watchNewPartySuccess,
    watchGetParty,
    watchJoinParty,
    allPartySagas,
  };
}
