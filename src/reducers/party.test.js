import party from './party';
import * as actions from 'actions/partyActions';

describe('party', () => {
  let initialState, newState;

  beforeEach(() => {
    initialState = party();
  });

  describe('default state', () => {
    it('defaults to blank name', () => {
      expect(initialState.name).toEqual('');
    });
  });

  it('handles PARTY_LOAD action', () => {
    const action = actions.loadParty({ name: 'New Year' });
    newState = party(initialState, action);
    expect(newState.name).toEqual('New Year');
  });
});
