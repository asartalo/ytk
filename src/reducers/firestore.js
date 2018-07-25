import { ActionTypes as types } from '../constants';

const wrapCurrentUser = (currentUser, db, auth) => {
  return (state, action) => {
    const newState = currentUser(state, action);
    if (newState !== state) {
      // something changed
      // TODO: save data
    }
    switch (action.type) {
      case types.FIRESTORE_GETTING_USER_DATA_SUCCESS:
        return {
          ...newState,
          ...action.data,
        };

      default:
        return newState;
    }
  };
};

export const wrapReducers = (reducers, db, auth) => {
  const { currentUser, error } = reducers;

  return {
    currentUser: wrapCurrentUser(currentUser, db, auth),
    firestore: firestore,
    error,
  };
};

const defaultState = {
  signedIn: false,
  userDataLoaded: false,
  uid: null,
};

export function firestore(state = defaultState, action = {}) {
  switch (action.type) {
    case types.FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS:
      return {
        ...state,
        signedIn: true,
        uid: action.data.user.uid,
      };
    case types.FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR:
      return {
        ...state,
        signedIn: false,
      };
    case types.FIRESTORE_GETTING_USER_DATA_SUCCESS:
    case types.FIRESTORE_GETTING_USER_DATA_ERROR:
    case types.FIRESTORE_USER_DATA_DOES_NOT_EXIST:
      return {
        ...state,
        userDataLoaded: true,
      };

    default:
      return state;
  }
}
