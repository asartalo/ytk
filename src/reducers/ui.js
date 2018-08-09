import { ActionTypes as types } from '../constants';

export const defaultState = {
  newPartyCreated: null,
  newPartyJoined: null,
};

export default function ui(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_NEW_SUCCESS:
      return {
        ...state,
        newPartyCreated: action.data.id,
      };
    case types.UI_NEW_PARTY_CREATED_CLEAR:
      return {
        ...state,
        newPartyCreated: null,
      };
    case types.PARTY_JOIN_SUCCESS:
      return {
        ...state,
        newPartyJoined: action.data,
      };
    case types.UI_NEW_PARTY_JOINED_CLEAR:
      return {
        ...state,
        newPartyJoined: null,
      };
    default:
      return state;
  }
}
