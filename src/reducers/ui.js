import { ActionTypes as types } from '../constants';
import { idToPath } from 'helpers/party';

export const defaultState = {
  redirectTo: null,
};

export default function ui(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_NEW_SUCCESS:
      return {
        ...state,
        redirectTo: idToPath(action.data.id),
      };
    case types.PARTY_JOIN_SUCCESS:
      return {
        ...state,
        redirectTo: idToPath(action.data),
      };

    case types.UI_REDIRECT_CLEAR:
      return {
        ...state,
        redirectTo: null,
      };

    case types.CURRENT_USER_SET_PARTY:
      return {
        ...state,
        redirectTo: idToPath(action.data),
      };
    default:
      return state;
  }
}
