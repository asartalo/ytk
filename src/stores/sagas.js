import { delay } from 'redux-saga';
import {
  take,
  call,
  all,
  apply,
  put,
  race,
  select,
  takeLatest,
} from 'redux-saga/effects';

import { ActionTypes as types } from '../constants';
import { setHomeState, loadUser } from 'actions/currentUserActions';
import { setErrorMessage } from 'actions/errorActions';
import {
  getUserDataError,
  getUserDataSuccess,
  saveUserError,
  saveUserStart,
  saveUserSuccess,
  signInAnonymouslyError,
  signInAnonymouslyRequest,
  signInAnonymouslySuccess,
  syncReady,
  userDataDoesNotExist,
} from 'actions/firestoreActions';

import partySagas from './partySagas';

export default function setup(db, auth) {
  const timedOutSignIn = {
    response: apply(auth, auth.signInAnonymously),
    timeout: delay(30000),
  };

  function* signInAnonymously() {
    yield put(signInAnonymouslyRequest());
    yield put(setHomeState('loading'));
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

  function* watchSignInError() {
    yield takeLatest(
      types.FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR,
      announceSignInError
    );
  }

  function* announceSignInError({ data }) {
    yield put(setErrorMessage(data.message));
    yield put(setHomeState('loaded'));
  }

  let usersRef;
  function usersCollection() {
    if (!usersRef) {
      usersRef = db.collection('users');
    }
    return usersRef;
  }

  let currentUserRef;
  function getCurrentUserFs(uid) {
    if (currentUserRef) return currentUserRef;
    if (!uid) throw Error('No UID SET');
    currentUserRef = usersCollection().doc(uid);
    return currentUserRef;
  }

  function getUserAndIdFromState() {
    return select(({ currentUser, firestore }) => ({
      currentUser,
      uid: firestore.uid,
    }));
  }

  function getUserFromState() {
    return select(({ currentUser }) => currentUser);
  }

  function setUserLoadedState(user) {
    return user.homeState === 'loading' || !user.homeState
      ? { ...user, homeState: 'loaded' }
      : user;
  }

  function* retrieveUserData() {
    let { uid } = yield getUserAndIdFromState();
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
      yield* loadUserToState(loadedUser);
    } else {
      // set new data
      yield put(userDataDoesNotExist(doc));
      yield put(setHomeState('loaded'));
      const currentUser = yield getUserFromState();
      yield* saveUser(currentUser, uid);
    }
    yield put(syncReady());
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

  function* loadUserToState(user) {
    yield put(loadUser(user));
  }

  function* saveUserWrap() {
    const { currentUser, uid } = yield getUserAndIdFromState();
    yield call(saveUser, currentUser, uid);
  }

  function* syncUserChanges() {
    yield take(types.FIRESTORE_SYNC_READY);
    yield takeLatest(
      action => action.type.match(/^CURRENT_USER/),
      saveUserWrap
    );
  }

  const { watchNewParty } = partySagas(db, auth);

  function* rootSaga() {
    yield all([
      signInAnonymously(),
      watchSignInSuccess(),
      watchSignInError(),
      syncUserChanges(),
      watchNewParty(),
      // watchSaveUserSuccess(),
    ]);
  }

  return {
    signInAnonymously,
    watchSignInSuccess,
    setUserLoadedState,
    retrieveUserData,
    timedOutSignIn,
    syncUserChanges,
    watchNewParty,
    saveUser,
    rootSaga,
  };
}
