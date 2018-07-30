import { put } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';

import { expectSaga } from 'redux-saga-test-plan';
import mockFirebase from 'firebase';

import setup, { signInAnonymouslyRequest } from './sagas';

import rootReducer from 'reducers/index';

describe('signInAnonymously', () => {
  let gen, sagas, db, auth;
  beforeEach(() => {
    db = mockFirebase.firestore();
    auth = mockFirebase.auth();
    sagas = setup(db, auth);
  });

  test('happy path', () => {
    const gen = sagas.signInAnonymously();
    expect(gen.next().value).toEqual(put(signInAnonymouslyRequest()));
  });
});

describe('rootSaga', () => {
  let sagas, db, auth;

  beforeEach(() => {
    db = mockFirebase.firestore();
    auth = mockFirebase.auth();
    sagas = setup(db, auth);
  });

  test('it works', () => {
    return expectSaga(sagas.rootSaga)
      .withReducer(rootReducer)
      .put(signInAnonymouslyRequest())
      .run();
  });
});
