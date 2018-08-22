import { ActionTypes as types } from '../constants';
import { select, take } from 'redux-saga/effects';

export function getUserAndUidFromState() {
  return select(({ currentUser, firestore }) => ({
    currentUser,
    uid: firestore.uid,
  }));
}

export function getUserFromState() {
  return select(({ currentUser }) => currentUser);
}

export function getUidFromState() {
  return select(({ firestore }) => firestore.uid);
}

export function getPartyFromState() {
  return select(({ party }) => party);
}

export function* continueIfSignedIn() {
  let uid = yield getUidFromState();
  if (!uid) {
    yield take(types.FIRESTORE_SYNC_READY);
  }
}
