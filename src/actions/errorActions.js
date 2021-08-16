import { ActionTypes as types } from '../constants';
import action from '../helpers/action';

export function setErrorMessage(message) {
  return action(types.ERROR_SET_MESSAGE, message);
}
