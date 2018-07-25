import { ActionTypes as types } from '../constants';

const defaultState = {
  name: '',
  intent: '',
  party: '',
  homeState: 'start',
};

export default function currentUser(state = defaultState, action = {}) {
  switch (action.type) {
    case types.CURRENT_USER_SET_NAME:
      return {
        ...state,
        name: action.data,
      };
    case types.CURRENT_USER_SET_NAME_AND_INTENT:
      return {
        ...state,
        name: action.data.name,
        intent: action.data.intent,
      };
    case types.CURRENT_USER_SET_PARTY:
      return {
        ...state,
        party: action.data,
      };
    case types.CURRENT_USER_UI_HOME_SET_STATE:
      return {
        ...state,
        homeState: action.data,
      };
    case types.FIRESTORE_SIGN_IN_ANONYMOUSLY_START:
      return {
        ...state,
        homeState: 'loading',
      };
    case types.FIRESTORE_GETTING_USER_DATA_ERROR:
    case types.FIRESTORE_GETTING_USER_DATA_SUCCESS:
      return {
        ...state,
        homeState: 'loaded',
      };
    case types.FIRESTORE_USER_DATA_DOES_NOT_EXIST:
      return {
        ...state,
        homeState: 'loaded',
      };
    default:
      return state;
  }
}
