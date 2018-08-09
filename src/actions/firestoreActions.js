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

export function userDataDoesNotExist() {
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

export function syncReady() {
  return action(types.FIRESTORE_SYNC_READY);
}
