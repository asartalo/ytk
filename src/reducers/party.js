import { ActionTypes as types } from '../constants';

export const defaultState = {
  name: '',
  users: [],
  queue: [],
};

export default function party(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_LOAD:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}
