import { ActionTypes as types } from '../constants';
import reducerTest from 'helpers/reducerTest';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/currentUserActions';
import * as partyActions from 'actions/partyActions';

import ui from './ui';

describe('ui', () => {
  const initialState = {
    redirectTo: null,
    partyJoinError: null,
    partyJoinInProgress: false,
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
  });
});
