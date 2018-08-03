import { ActionTypes as types } from '../constants';
import { clearNewPartyCreated } from 'actions/uiActions';
import { newPartySuccess } from 'actions/partyActions';

import ui from './ui';

describe('ui', () => {
  let initialState;

  beforeEach(() => {
    initialState = ui();
  });

  describe('default state', () => {
    it('is null for newPartyCreated', () => {
      expect(initialState.newPartyCreated).toBe(null);
    });
  });

  it('handles PARTY_NEW_SUCCESS', () => {
    const action = newPartySuccess({ name: 'The Party' }, 'the-party-8988');
    const state = ui(initialState, action);
    expect(state.newPartyCreated).toEqual('the-party-8988');
  });

  it('handles UI_NEW_PARTY_CREATED_CLEAR', () => {
    initialState.newPartyCreated = 'the-other-party-1112';
    const action = clearNewPartyCreated();
    const state = ui(initialState, action);
    expect(state.newPartyCreated).toBe(null);
  });
});
