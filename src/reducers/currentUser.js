import { ActionTypes as types } from '../constants';
import { currentUserShape, validateReducer } from 'components/propTypes';

const defaultState = {
  name: '',
  intent: '',
  party: '',
  homeState: 'start',
  playerShowAddMenu: false,
};

export function currentUser(state = defaultState, action = {}) {
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
    case types.PARTY_JOIN_SUCCESS:
      return {
        ...state,
        party: action.data,
      };
    case types.PARTY_NEW_SUCCESS:
      return {
        ...state,
        party: action.data.id,
      };
    case types.CURRENT_USER_UI_HOME_SET_STATE:
      return {
        ...state,
        homeState: action.data,
      };
    case types.CURRENT_USER_LOAD_USER:
      return {
        ...state,
        ...action.data,
      };
    case types.CURRENT_USER_SHOW_ADD_MENU:
      return {
        ...state,
        playerShowAddMenu: true,
      };
    case types.CURRENT_USER_HIDE_ADD_MENU:
      return {
        ...state,
        playerShowAddMenu: false,
      };
    default:
      return state;
  }
}

export default validateReducer(currentUserShape, 'currentUser')(currentUser);
