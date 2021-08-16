import reducerTest from '../helpers/reducerTest';
import * as fActions from '../actions/firestoreActions';

import firestore from './firestore';

describe('firestore', () => {
  const initialState = {
    signedIn: false,
    userDataLoaded: false,
    partyLoaded: false,
    uid: null,
  };

  reducerTest(firestore, initialState, {
    FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS: {
      action: fActions.signInAnonymouslySuccess({ uid: 'FOOBAR' }),
      expect: { signedIn: true, uid: 'FOOBAR' },
    },

    FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR: {
      from: { signedIn: true },
      action: fActions.signInAnonymouslyError(Error('Something happened')),
      expect: { signedIn: false },
    },

    FIRESTORE_SYNC_READY: {
      action: fActions.syncReady(),
      expect: { userDataLoaded: true },
    },
  });
});
