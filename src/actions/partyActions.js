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

export function getPartySuccess(id, party) {
  return action(types.PARTY_GET_SUCCESS, { id, party });
}

export function getPartyError(partyId) {
  return action(types.PARTY_GET_ERROR, partyId);
}

export function joinParty(partyId) {
  return action(types.PARTY_JOIN, partyId);
}

export function joinPartySuccess(partyId) {
  return action(types.PARTY_JOIN_SUCCESS, partyId);
}

export function joinPartyError(error) {
  return action(types.PARTY_JOIN_ERROR, error);
}

export function partyUpdated(party) {
  return action(types.PARTY_UPDATED, party);
}

export function unloadParty(partyId) {
  return action(types.PARTY_UNLOAD, partyId);
}

export function search(query) {
  return action(types.PARTY_SEARCH, query);
}

export function searchResult(result) {
  return action(types.PARTY_SEARCH_RESULT, result);
}

export function addToQueue(video, addedBy) {
  return action(types.PARTY_ADD_TO_QUEUE, { video, addedBy });
}

export function updateParty(party) {
  return action(types.PARTY_UPDATE_PARTY, party);
}

export function removeFromQueue(video) {
  return action(types.PARTY_REMOVE_FROM_QUEUE, video);
}
