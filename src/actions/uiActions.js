import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function clearRedirect() {
  return action(types.UI_REDIRECT_CLEAR);
}
