import { ActionTypes as types } from '../constants';
import { idToPath } from 'helpers/party';

export const defaultState = {
  redirectTo: null,
  partyJoinError: null,
  partyJoinInProgress: false,
  partyGetInProgress: false,
  searchResults: [],
};

export default function ui(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_NEW_SUCCESS:
      return {
        ...state,
        redirectTo: idToPath(action.data.id),
      };

    case types.PARTY_JOIN:
      return {
        ...state,
        partyJoinInProgress: true,
        partyJoinError: null,
      };

    case types.PARTY_JOIN_SUCCESS:
      return {
        ...state,
        redirectTo: idToPath(action.data),
        partyJoinInProgress: false,
      };

    case types.PARTY_JOIN_ERROR:
      return {
        ...state,
        partyJoinError: action.data.message,
        partyJoinInProgress: false,
      };

    case types.PARTY_GET:
      return {
        ...state,
        partyGetInProgress: true,
      };

    case types.PARTY_LOAD:
      return {
        ...state,
        partyGetInProgress: false,
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

    case types.PARTY_SEARCH_RESULT:
      return {
        ...state,
        searchResults: action.data,
      };

    case types.PARTY_ADD_TO_QUEUE:
      return {
        ...state,
        searchResults: [],
      };

    default:
      return state;
  }
}
