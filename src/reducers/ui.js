import { ActionTypes as types } from '../constants';

export const defaultState = {
  newPartyCreated: null,
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
    default:
      return state;
  }
}
