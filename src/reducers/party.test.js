import reducerTest from 'helpers/reducerTest';
import * as actions from 'actions/partyActions';
import party from './party';

describe('party', () => {
  const initialState = {
    name: '',
    users: [],
    queue: [],
    id: '',
  };

  reducerTest(party, initialState, {
    PARTY_LOAD: {
      action: actions.loadParty({ name: 'New Year' }),
      expect: { name: 'New Year' },
    },
  });
});
