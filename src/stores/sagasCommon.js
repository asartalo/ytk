import { select } from 'redux-saga/effects';

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
