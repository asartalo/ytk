import { ActionTypes as types } from '../constants';

const defaultState = {
  signedIn: false,
  userDataLoaded: false,
  partyLoaded: false,
  uid: null,
};

export default function firestore(state = defaultState, action = {}) {
  switch (action.type) {
    case types.FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS:
      return {
        ...state,
        signedIn: true,
        uid: action.data.uid,
      };
    case types.FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR:
      return {
        ...state,
        signedIn: false,
      };
    case types.FIRESTORE_SYNC_READY:
      return {
        ...state,
        userDataLoaded: true,
      };

    default:
      return state;
  }
}
