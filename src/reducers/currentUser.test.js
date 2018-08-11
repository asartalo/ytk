import currentUser from './currentUser';
import * as actions from '../actions/currentUserActions';
import { joinPartySuccess, newPartySuccess } from 'actions/partyActions';

describe('currentUser', () => {
  let initialState, newState;

  beforeEach(() => {
    initialState = { ...currentUser() };
  });

  describe('default state', () => {
    it('defaults to blank name', () => {
      expect(initialState.name).toEqual('');
    });

    it('blank intent', () => {
      expect(initialState.intent).toEqual('');
    });

    it('has blank party', () => {
      expect(initialState.party).toEqual('');
    });
  });

  it('noops for invalid action', () => {
    newState = currentUser(initialState, 'foo');
    expect(newState).toEqual(initialState);
  });

  it('handles CURRENT_USER_SET_NAME action', () => {
    const action = actions.setName('Jane');
    newState = currentUser(initialState, action);
    expect(newState.name).toEqual('Jane');
  });

  it('handles CURRENT_USER_SET_NAME_AND_INTENT action', () => {
    const action = actions.setNameAndIntent('John', 'start');
    newState = currentUser(initialState, action);
    expect(newState.name).toEqual('John');
    expect(newState.intent).toEqual('start');
  });

  it('handles CURRENT_USER_SET_PARTY action', () => {
    const action = actions.setParty('a-party-id-8888');
    newState = currentUser(initialState, action);
    expect(newState.party).toEqual('a-party-id-8888');
  });

  it('handles PARTY_JOIN_SUCCESS action', () => {
    const action = joinPartySuccess('the-party-id-1777');
    newState = currentUser(initialState, action);
    expect(newState.party).toEqual('the-party-id-1777');
  });

  it('handles PARTY_NEW_SUCCESS action', () => {
    const action = newPartySuccess({ name: 'The Party' }, 'the-party-id-1777');
    newState = currentUser(initialState, action);
    expect(newState.party).toEqual('the-party-id-1777');
  });
});
