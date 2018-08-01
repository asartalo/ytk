import { ActionTypes as types } from '../constants';

const defaultState = {
  name: '',
};

export default function party(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_NEW:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}
