import { ActionTypes as types } from '../constants';
import { partyShape, validateReducer } from 'components/propTypes';

export const defaultState = {
  name: '',
  users: [],
  queue: [],
};

export function party(state = defaultState, action = {}) {
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

export default validateReducer(partyShape, 'party')(party);
