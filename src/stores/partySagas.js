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
import { eventChannel, delay } from 'redux-saga';

import { ActionTypes as types } from '../constants';
import * as partyActions from '../actions/partyActions';
import { setParty } from '../actions/currentUserActions';
import {
  continueIfSignedIn,
  getUidFromState,
  getUserAndUidFromState,
  getPartyFromState,
} from './sagasCommon';
import { defaultState as defaultParty } from '../reducers/party';
import { hasPartyChanged } from '../helpers/party';

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
    const isMember = isPartyMember(party, yield getUidFromState());
    if (isMember) {
      yield put(partyActions.loadParty(party));
      const syncTask = yield fork(watchSyncChanges, data);
      yield take(types.PARTY_UNLOAD);
      yield cancel(syncTask);
    } else {
      yield put(partyActions.notAMember(data));
    }
  }

  function isPartyMember({ users }, userUid) {
    return (users || []).find(({ uid }) => uid === userUid);
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
    const party = yield getPartyFromState();
    if (hasPartyChanged(party, action.data)) {
      yield put(partyActions.loadParty(action.data));
    }
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
    let task;
    while (true) {
      const action = yield take(action => {
        switch (action.type) {
          case types.PARTY_ADD_TO_QUEUE:
          case types.PARTY_REMOVE_FROM_QUEUE:
          case types.PARTY_SET_CURRENT_PLAYBACK:
          case types.PARTY_SET_CURRENT_AT:
          case types.PARTY_SKIP:
            return true;
          default:
            return false;
        }
      });
      if (task) {
        yield cancel(task);
      }
      task = yield fork(syncPartyChanges, action);
    }
  }

  function* syncPartyChanges() {
    yield delay(300);
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
    watchPartyUpdated,
    watchPartyChanges,
    watchSearch,
    allPartySagas,
  };
}
