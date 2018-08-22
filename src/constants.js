import enforcedActionTypes from 'helpers/enforcedActionTypes';

export const ActionTypes = enforcedActionTypes(
  // Errors
  'ERROR_SET_MESSAGE',

  // currentUser
  'CURRENT_USER_SET_NAME',
  'CURRENT_USER_SET_NAME_AND_INTENT',
  'CURRENT_USER_SET_PARTY',
  'CURRENT_USER_UI_HOME_SET_STATE',
  'CURRENT_USER_LOAD_USER',
  'CURRENT_USER_SHOW_ADD_MENU',
  'CURRENT_USER_HIDE_ADD_MENU',

  // party
  'PARTY_NEW',
  'PARTY_NEW_SUCCESS',
  'PARTY_NEW_ERROR',
  'PARTY_LOAD',
  'PARTY_GET',
  'PARTY_GET_SUCCESS',
  'PARTY_GET_ERROR',
  'PARTY_JOIN',
  'PARTY_JOIN_SUCCESS',
  'PARTY_JOIN_ERROR',
  'PARTY_UPDATED',
  'PARTY_UNLOAD',
  'PARTY_SEARCH',
  'PARTY_SEARCH_RESULT',
  'PARTY_ADD_TO_QUEUE',
  'PARTY_UPDATE_PARTY',
  'PARTY_REMOVE_FROM_QUEUE',

  // UI
  'UI_REDIRECT',
  'UI_REDIRECT_CLEAR',

  // firestore
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_REQUEST',
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS',
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR',
  'FIRESTORE_GETTING_USER_DATA',
  'FIRESTORE_GETTING_USER_DATA_SUCCESS',
  'FIRESTORE_GETTING_USER_DATA_ERROR',
  'FIRESTORE_USER_DATA_DOES_NOT_EXIST',
  'FIRESTORE_SYNC_READY',
  'FIRESTORE_SAVE_USER_DATA',
  'FIRESTORE_SAVE_USER_DATA_SUCCESS',
  'FIRESTORE_SAVE_USER_DATA_ERROR'
);

export const easings = {
  rubber: '500ms cubic-bezier(.61,-0.3,.39,1)',
};
