import { ActionTypes as types } from '../constants';
import reducerTest from 'helpers/reducerTest';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/currentUserActions';
import * as partyActions from 'actions/partyActions';

import staticQueueData from 'components/party/staticQueueData';

import ui from './ui';

describe('ui', () => {
  const initialState = {
    redirectTo: null,
    partyJoinError: null,
    partyJoinInProgress: false,
    partyGetInProgress: false,
    searchResults: [],
  };

  reducerTest(ui, initialState, {
    PARTY_NEW_SUCCESS: {
      action: partyActions.newPartySuccess(
        { name: 'The Party' },
        'the-party-8988'
      ),
      expect: { redirectTo: '/the-party-8988' },
    },

    UI_REDIRECT_CLEAR: {
      from: { redirectTo: '/the-other-party-1112' },
      action: uiActions.clearRedirect(),
      expect: {
        /* back to initial state */
      },
    },

    CURRENT_USER_SET_PARTY: {
      action: userActions.setParty('another-party-8888'),
      expect: { redirectTo: '/another-party-8888' },
    },

    PARTY_JOIN: {
      from: { partyJoinError: 'Some error' },
      action: partyActions.joinParty('the-party-id-1234'),
      expect: { partyJoinError: null, partyJoinInProgress: true },
    },

    PARTY_JOIN_SUCCESS: {
      from: { partyJoinInProgress: true },
      action: partyActions.joinPartySuccess('another-party-8888'),
      expect: {
        redirectTo: '/another-party-8888',
        partyJoinInProgress: false,
      },
    },

    PARTY_JOIN_ERROR: {
      from: { partyJoinInProgress: true },
      action: partyActions.joinPartyError(Error('Cannot join party')),
      expect: { partyJoinError: 'Cannot join party' },
    },

    PARTY_GET: {
      action: partyActions.getParty('the-id-of-party-8398'),
      expect: { partyGetInProgress: true },
    },

    PARTY_LOAD: {
      from: { partyGetInProgress: true },
      action: partyActions.loadParty({ name: 'Foo' }),
      expect: { partyGetInProgress: false },
    },

    PARTY_SEARCH_RESULT: {
      action: partyActions.searchResult(staticQueueData),
      expect: { searchResults: staticQueueData },
    },

    PARTY_ADD_TO_QUEUE: {
      from: { searchResults: staticQueueData },
      action: partyActions.addToQueue(staticQueueData[0]),
      expect: { searchResults: [] },
    },
  });
});
