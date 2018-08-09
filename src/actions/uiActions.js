import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function clearNewPartyCreated() {
  return action(types.UI_NEW_PARTY_CREATED_CLEAR);
}

export function clearNewPartyJoined() {
  return action(types.UI_NEW_PARTY_JOINED_CLEAR);
}
