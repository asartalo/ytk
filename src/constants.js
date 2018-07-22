import enforcedActionTypes from 'enforcedActionTypes';

export const ActionTypes = enforcedActionTypes([
  // currentUserActions
  'CURRENT_USER_SET_NAME',
  'CURRENT_USER_SET_NAME_AND_INTENT',
  'CURRENT_USER_SET_PARTY',

  // ui
  'UI_HOME_SET_STATE',
]);

export const easings = {
  rubber: '500ms cubic-bezier(.61,-0.3,.39,1)',
};
