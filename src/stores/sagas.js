import { delay } from 'redux-saga';
import {
  all,
  apply,
  call,
  put,
  race,
  select,
  takeLatest,
} from 'redux-saga/effects';

import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function signInAnonymouslyRequest() {
  return action(types.FIRESTORE_SIGN_IN_ANONYMOUSLY_REQUEST);
}

export function signInAnonymouslySuccess(response) {
  return action(types.FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS, response);
}

export function signInAnonymouslyError(error) {
  return action(types.FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR, error);
}

export function getUserDataSuccess(data) {
  return action(types.FIRESTORE_GETTING_USER_DATA_SUCCESS, data);
}

export function getUserDataError(error) {
  return action(types.FIRESTORE_GETTING_USER_DATA_ERROR);
}

export function userDataDoesNotExist(doc) {
  return action(types.FIRESTORE_USER_DATA_DOES_NOT_EXIST);
}

export function saveUserStart(user, uid) {
  return action(types.FIRESTORE_SAVE_USER_DATA);
}

export function saveUserError(error) {
  return action(types.FIRESTORE_SAVE_USER_DATA_ERROR);
}

export function saveUserSuccess(user) {
  return action(types.FIRESTORE_SAVE_USER_DATA_SUCCESS);
}

export default function setup(db, auth) {
  const timedOutSignIn = {
    response: apply(auth, auth.signInAnonymously),
    timeout: delay(30000),
  };

  function* signInAnonymously() {
    yield put(signInAnonymouslyRequest());
    try {
      const { response } = yield race(timedOutSignIn);
      if (response) {
        yield put(signInAnonymouslySuccess(response));
      } else {
        yield put(signInAnonymouslyError(Error('Sign in timeout')));
      }
    } catch (error) {
      yield put(signInAnonymouslyError(error));
    }
  }

  function* watchSignInSuccess() {
    yield takeLatest(
      types.FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS,
      retrieveUserData
    );
  }

  let usersRef;
  const usersCollection = function() {
    if (!usersRef) {
      usersRef = db.collection('users');
    }
    return usersRef;
  };

  let currentUserRef;
  function getCurrentUserFs(uid) {
    if (currentUserRef) return currentUserRef;
    if (!uid) throw Error('No UID SET');
    currentUserRef = usersCollection().doc(uid);
    return currentUserRef;
  }

  function getUserAndIdFromState() {
    return select(state => {
      return {
        currentUser: state.currentUser,
        uid: state.firestore.uid,
      };
    });
  }

  function setUserLoadedState(user) {
    return user.homeState === 'loading'
      ? { ...user, homeState: 'loaded' }
      : user;
  }

  function* retrieveUserData() {
    const { currentUser, uid } = yield getUserAndIdFromState();
    const currentUserRef = getCurrentUserFs(uid);
    let doc;
    try {
      doc = yield apply(currentUserRef, currentUserRef.get);
    } catch (error) {
      yield put(getUserDataError(error));
    }
    if (doc.exists) {
      const loadedUser = setUserLoadedState(doc.data());
      yield put(getUserDataSuccess(loadedUser));
    } else {
      // set new data
      put(userDataDoesNotExist(doc));
      yield* saveUser(setUserLoadedState(currentUser), uid);
    }
  }

  function* saveUser(user, uid) {
    yield put(saveUserStart(user, uid));
    try {
      const userRef = getCurrentUserFs(uid);
      const savedUser = yield apply(userRef, userRef.set, [user]);
      yield put(saveUserSuccess(savedUser));
    } catch (error) {
      yield put(saveUserError(error));
    }
  }

  // TODO: This could loop?
  // function* watchSaveUserSuccess() {
  //   yield takeLatest(types.FIRESTORE_SAVE_USER_DATA_SUCCESS, loadUser);
  // }
  //
  // function* loadUser(user) {
  //   const { currentUser, uid } = yield select((state) => {
  //   return {
  //     currentUser: state.currentUser,
  //     uid: state.firestore.uid,
  //   };
  //   });
  // }

  function* rootSaga() {
    yield all([
      signInAnonymously(),
      watchSignInSuccess(),
      // watchSaveUserSuccess(),
    ]);
  }

  return {
    signInAnonymously,
    watchSignInSuccess,
    setUserLoadedState,
    retrieveUserData,
    timedOutSignIn,
    rootSaga,
  };
}
