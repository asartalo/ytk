import { ActionTypes as types } from '../constants';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/currentUserActions';
import * as partyActions from 'actions/partyActions';

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

    it('is null for partyJoinError', () => {
      expect(initialState.partyJoinError).toBe(null);
    });

    it('is false for partyJoinInProgress', () => {
      expect(initialState.partyJoinInProgress).toBe(false);
    });
  });

  it('handles PARTY_NEW_SUCCESS', () => {
    const action = partyActions.newPartySuccess(
      { name: 'The Party' },
      'the-party-8988'
    );
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/the-party-8988');
  });

  it('handles UI_REDIRECT_CLEAR', () => {
    initialState.redirectTo = '/the-other-party-1112';
    const action = uiActions.clearRedirect();
    const state = ui(initialState, action);
    expect(state.redirectTo).toBe(null);
  });

  it('handles CURRENT_USER_SET_PARTY', () => {
    const action = userActions.setParty('another-party-8888');
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/another-party-8888');
  });

  it('handles PARTY_JOIN', () => {
    initialState.partyJoinError = 'Some error';
    const action = partyActions.joinParty('the-party-id-1234');
    const state = ui(initialState, action);
    expect(state.partyJoinInProgress).toBe(true);
    expect(state.partyJoinError).toBe(null);
  });

  it('handles PARTY_JOIN_SUCCESS', () => {
    initialState.partyJoinInProgress = true;
    const action = partyActions.joinPartySuccess('another-party-8888');
    const state = ui(initialState, action);
    expect(state.redirectTo).toEqual('/another-party-8888');
    expect(state.partyJoinInProgress).toBe(false);
  });

  it('handles PARTY_JOIN_ERROR', () => {
    initialState.partyJoinInProgress = true;
    const action = partyActions.joinPartyError(Error('Cannot join party'));
    const state = ui(initialState, action);
    expect(state.partyJoinError).toEqual('Cannot join party');
    expect(state.partyJoinInProgress).toBe(false);
  });
});
