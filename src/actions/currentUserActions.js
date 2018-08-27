import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function setName(name) {
  return action(types.CURRENT_USER_SET_NAME, name);
}

export function setNameAndIntent(name, intent) {
  return action(types.CURRENT_USER_SET_NAME_AND_INTENT, { name, intent });
}

export function setIntent(intent) {
  return action(types.CURRENT_USER_SET_INTENT, intent);
}

export function setParty(partyId) {
  return action(types.CURRENT_USER_SET_PARTY, partyId);
}

export function setHomeState(state) {
  return action(types.CURRENT_USER_UI_HOME_SET_STATE, state);
}

export function loadUser(user) {
  return action(types.CURRENT_USER_LOAD_USER, user);
}

export function showAddMenu() {
  return action(types.CURRENT_USER_SHOW_ADD_MENU);
}

export function hideAddMenu() {
  return action(types.CURRENT_USER_HIDE_ADD_MENU);
}
