import { ActionTypes as types } from '../constants';
import { clearRedirect } from 'actions/uiActions';
import { setParty } from 'actions/currentUserActions';
import { joinPartySuccess, newPartySuccess } from 'actions/partyActions';

import ui from './ui';

describe('ui', () => {
  let initialState;

  beforeEach(() => {
    initialState = { ...ui() };
  });

  describe('default state', () => {
    it('is null for redirectTo', () => {
      expect(initialState.redirectTo).toBe(null);
    });
  });

  it('handles PARTY_NEW_SUCCESS', () => {
    const action = newPartySuccess({ name: 'The Party' }, 'the-party-8988');
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/the-party-8988');
  });

  it('handles PARTY_JOIN_SUCCESS', () => {
    const action = joinPartySuccess('another-party-8888');
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/another-party-8888');
  });

  it('handles UI_REDIRECT_CLEAR', () => {
    initialState.redirectTo = '/the-other-party-1112';
    const action = clearRedirect();
    const state = ui(initialState, action);
    expect(state.redirectTo).toBe(null);
  });

  it('handles CURRENT_USER_SET_PARTY', () => {
    const action = setParty('another-party-8888');
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/another-party-8888');
  });
});
