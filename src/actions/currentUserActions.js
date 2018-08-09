import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function setName(name) {
  return action(types.CURRENT_USER_SET_NAME, name);
}

export function setNameAndIntent(name, intent) {
  return action(types.CURRENT_USER_SET_NAME_AND_INTENT, { name, intent });
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

export function userNotSignedIn() {
  return action(types.CURRENT_USER_NOT_SIGNED_IN);
}
