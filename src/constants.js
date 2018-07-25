import enforcedActionTypes from 'enforcedActionTypes';

export const ActionTypes = enforcedActionTypes([
  // currentUserActions
  'CURRENT_USER_SET_NAME',
  'CURRENT_USER_SET_NAME_AND_INTENT',
  'CURRENT_USER_SET_PARTY',
  'CURRENT_USER_UI_HOME_SET_STATE',

  // firestore
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_START',
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS',
  'FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR',
  'FIRESTORE_GETTING_USER_DATA',
  'FIRESTORE_GETTING_USER_DATA_SUCCESS',
  'FIRESTORE_USER_DATA_DOES_NOT_EXIST',
  'FIRESTORE_GETTING_USER_DATA_ERROR',

  'FIRESTORE_SAVE_USER_DATA',
  'FIRESTORE_SAVE_USER_DATA_SUCCESS',
  'FIRESTORE_SAVE_USER_DATA_ERROR',
]);

export const easings = {
  rubber: '500ms cubic-bezier(.61,-0.3,.39,1)',
};