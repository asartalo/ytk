import {
  all,
  cancel,
  cancelled,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { ActionTypes as types } from '../constants';
import * as partyActions from 'actions/partyActions';
import { setParty } from 'actions/currentUserActions';
import {
  continueIfSignedIn,
  getUserAndUidFromState,
  getPartyFromState,
} from './sagasCommon';
import { defaultState as defaultParty } from 'reducers/party';

export default function partySagas(ytkFire, ytSearch) {
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
    yield takeLatest(types.PARTY_GET, getParty);
  }

  function* getParty({ data }) {
    yield* continueIfSignedIn();
    const party = yield ytkFire.getParty(data);
    yield put(partyActions.loadParty(party));
    const syncTask = yield fork(watchSyncChanges, data);
    yield take(types.PARTY_UNLOAD);
    yield cancel(syncTask);
  }

  function partySync(partyId) {
    return eventChannel(emitter =>
      ytkFire.syncParty(partyId, doc => {
        emitter(doc.data());
      })
    );
  }

  function* watchSyncChanges(partyId) {
    const chan = partySync(partyId);
    try {
      while (true) {
        const party = yield take(chan);
        yield put(partyActions.partyUpdated(party));
      }
    } finally {
      if (yield cancelled()) {
        chan.close();
      }
    }
  }

  function* watchPartyUpdated() {
    yield takeLatest(types.PARTY_UPDATED, partyUpdated);
  }

  function* partyUpdated(action) {
    yield put(partyActions.loadParty(action.data));
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

  function* watchSearch() {
    yield takeLatest(types.PARTY_SEARCH, searchVideos);
  }

  function* searchVideos(action) {
    yield* continueIfSignedIn();
    const searchResult = yield ytSearch('karaoke ' + action.data);
    yield put(partyActions.searchResult(searchResult));
  }

  function* watchPartyChanges() {
    yield* continueIfSignedIn();
    yield takeLatest(action => {
      switch (action.type) {
        case types.PARTY_ADD_TO_QUEUE:
        case types.PARTY_REMOVE_FROM_QUEUE:
        case types.PARTY_SET_CURRENT_PLAYBACK:
        case types.PARTY_SKIP:
          return true;
        default:
          return false;
      }
    }, syncPartyChanges);
  }

  function* syncPartyChanges() {
    const party = yield getPartyFromState();
    yield put(partyActions.updateParty(party));
    yield ytkFire.saveParty(party.id, party);
  }

  function* allPartySagas() {
    yield all([
      watchNewParty(),
      watchNewPartySuccess(),
      watchGetParty(),
      watchJoinParty(),
      watchPartyUpdated(),
      watchPartyChanges(),
      watchSearch(),
    ]);
  }

  return {
    watchNewParty,
    watchNewPartySuccess,
    watchGetParty,
    watchJoinParty,
    watchPartyChanges,
    watchSearch,
    allPartySagas,
  };
}
