import { ActionTypes as types } from '../constants';

const defaultState = { errorMsg: '' };

export default function error(state = defaultState, action) {
  switch (action.type) {
    case types.ERROR_SET_MESSAGE:
      return {
        ...state,
        errorMsg: action.data,
      };

    default:
      return state;
  }
}
