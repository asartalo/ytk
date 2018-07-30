import { expectSaga } from 'redux-saga-test-plan';

import setup from './sagas';

import rootReducer from 'reducers/index';

describe('rootSaga', () => {
  let sagas, db, auth;

  let fakeAuthUser = { uid: 'FAKEUID' };
  let fakeResponse = { user: fakeAuthUser };
  let signInResponse = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, 0);
  });

  let fakeUserData = {
    name: 'John',
    intent: '',
    party: '',
  };

  let fakeUserDoc = {
    exists: true,
    data: () => fakeUserData,
  };

  let fakeUserDocResponse = () =>
    new Promise(resolve => {
      setTimeout(resolve, 0, fakeUserDoc);
    });

  let fakeUserDocRef = uid => ({
    get: () => fakeUserDocResponse(),
    set: user =>
      new Promise(resolve => {
        setTimeout(resolve, 0);
      }),
  });

  let fakeCollection = collection => ({
    doc: fakeUserDocRef,
  });

  beforeEach(() => {
    db = {
      collection: fakeCollection,
    };
    auth = {
      signInAnonymously: () => signInResponse,
    };
    sagas = setup(db, auth);
  });

  test('happy path: revisiting user', () => {
    const finalState = rootReducer({}, {});
    finalState.currentUser = { ...fakeUserData, homeState: 'loaded' };
    finalState.firestore = {
      ...finalState.firestore,
      signedIn: true,
      userDataLoaded: true,
      uid: fakeAuthUser.uid,
    };

    return expectSaga(sagas.rootSaga)
      .withReducer(rootReducer)
      .hasFinalState(finalState)
      .silentRun();
  });

  test('happy path: new user', () => {
    fakeUserDoc = { exists: false };
    // fakeUserData = ;
    const finalState = rootReducer({}, {});
    finalState.currentUser = { ...finalState.currentUser, homeState: 'loaded' };
    finalState.firestore = {
      ...finalState.firestore,
      signedIn: true,
      userDataLoaded: false,
      uid: fakeAuthUser.uid,
    };

    return expectSaga(sagas.rootSaga)
      .withReducer(rootReducer)
      .hasFinalState(finalState)
      .silentRun();
  });

  test('failed path: error on signIn', () => {
    signInResponse = new Promise((_, reject) => {
      setTimeout(reject, 0, Error('Something happened while signing in'));
    });
    const finalState = rootReducer({}, {});
    finalState.currentUser = {
      ...finalState.currentUser,
      homeState: 'loaded',
    };
    finalState.error = {
      ...finalState.error,
      errorMsg: 'Something happened while signing in',
    };
    finalState.firestore = {
      ...finalState.firestore,
      signedIn: false,
      userDataLoaded: false,
    };

    return expectSaga(sagas.rootSaga)
      .withReducer(rootReducer)
      .hasFinalState(finalState)
      .silentRun();
  });
});
