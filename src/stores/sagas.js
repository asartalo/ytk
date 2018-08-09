import { take, call, all, put, takeLatest } from 'redux-saga/effects';

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
import { getUserFromState } from './sagasCommon';
import { UserDataDoesNotExist } from '../YtkFire';

import partySagas from './partySagas';

export default function setup(ytkFire) {
  function* signInAnonymously() {
    yield put(signInAnonymouslyRequest());
    yield put(setHomeState('loading'));
    try {
      const response = yield ytkFire.signInAnonymously();
      yield put(signInAnonymouslySuccess(response));
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

  function setUserLoadedState(user) {
    return user.homeState === 'loading' || !user.homeState
      ? { ...user, homeState: 'loaded' }
      : user;
  }

  function* retrieveUserData() {
    try {
      const data = yield ytkFire.retrieveUserData();
      const loadedUser = setUserLoadedState(data);
      yield put(getUserDataSuccess(loadedUser));
      yield* loadUserToState(loadedUser);
    } catch (error) {
      if (error instanceof UserDataDoesNotExist) {
        // set new data
        yield put(userDataDoesNotExist());
        yield put(setHomeState('loaded'));
        const currentUser = yield getUserFromState();
        yield* saveUser(currentUser);
      } else {
        yield put(getUserDataError(error));
      }
    }
    yield put(syncReady());
  }

  function* saveUser(userData) {
    yield put(saveUserStart(userData, ytkFire.uid));
    try {
      const savedUser = yield ytkFire.saveUser(userData);
      yield put(saveUserSuccess(savedUser));
    } catch (error) {
      yield put(saveUserError(error));
    }
  }

  function* loadUserToState(user) {
    yield put(loadUser(user));
  }

  function* saveUserWrap() {
    const currentUser = yield getUserFromState();
    yield call(saveUser, currentUser);
  }

  function* syncUserChanges() {
    yield take(types.FIRESTORE_SYNC_READY);
    yield takeLatest(
      action => action.type.match(/^CURRENT_USER/),
      saveUserWrap
    );
  }

  const { allPartySagas } = partySagas(ytkFire);

  function* rootSaga() {
    yield all([
      signInAnonymously(),
      watchSignInSuccess(),
      watchSignInError(),
      syncUserChanges(),
      allPartySagas(),
    ]);
  }

  return {
    signInAnonymously,
    watchSignInSuccess,
    setUserLoadedState,
    retrieveUserData,
    syncUserChanges,
    saveUser,
    rootSaga,
  };
}
