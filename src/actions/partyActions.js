import { ActionTypes as types } from '../constants';
import action from 'helpers/action';

export function newParty(party) {
  return action(types.PARTY_NEW, party);
}

export function newPartySuccess(party, id) {
  return action(types.PARTY_NEW_SUCCESS, { party, id });
}

export function newPartyError(error) {
  return action(types.PARTY_NEW_ERROR, error);
}

export function loadParty(party) {
  return action(types.PARTY_LOAD, party);
}

export function getParty(partyId) {
  return action(types.PARTY_GET, partyId);
}
