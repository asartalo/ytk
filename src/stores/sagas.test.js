import { expectSaga } from 'redux-saga-test-plan';

import setup from './sagas';

import rootReducer from 'reducers/index';

describe('rootSaga', () => {
  let sagas, db, auth;

  const fakeAuthUser = { uid: 'FAKEUID' };
  const fakeResponse = { user: fakeAuthUser };
  const successSignIn = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, 0);
  });

  let fakeUserData = {
    name: 'John',
    intent: '',
    party: '',
  };

  let fakeDoc = {
    exists: true,
    data: () => fakeUserData,
  };

  let fakeDocResponse = new Promise(resolve => {
    setTimeout(resolve, 10, fakeDoc);
  });

  let fakeDoRef = uid => {
    return {
      get: () => fakeDocResponse,
    };
  };

  let fakeCollection = collection => {
    return {
      doc: fakeDoRef,
    };
  };

  beforeEach(() => {
    // db = mockFirebase.firestore();
    // auth = mockFirebase.auth();
    db = {
      collection: fakeCollection,
    };
    auth = {};
    auth.signInAnonymously = () => {
      return successSignIn;
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
});
