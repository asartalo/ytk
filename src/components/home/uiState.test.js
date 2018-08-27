import currentUserReducer from 'reducers/currentUser';
import firestoreReducer from 'reducers/firestore';
import uiState from './uiState';

describe('uiState()', () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      currentUser: { ...currentUserReducer() },
      firestore: { ...firestoreReducer() },
    };
  });

  Object.entries({
    loading: {
      firestore: { userDataLoaded: false },
    },
    first_time: {
      firestore: { userDataLoaded: true },
      currentUser: { name: '' },
    },
    choose_party: {
      firestore: { userDataLoaded: true },
      currentUser: {
        name: 'Laura',
        intent: '',
      },
    },
    start_party: {
      firestore: { userDataLoaded: true },
      currentUser: {
        name: 'Laura',
        intent: 'start',
      },
    },
    join_party: {
      firestore: { userDataLoaded: true },
      currentUser: {
        name: 'Laura',
        intent: 'join',
      },
    },
  }).forEach(([expected, state]) => {
    it(`correctly handles '${expected}' state`, () => {
      const completeState = {
        currentUser: {
          ...initialState.currentUser,
          ...(state.currentUser || {}),
        },
        firestore: {
          ...initialState.firstore,
          ...(state.firestore || {}),
        },
      };
      expect(uiState(completeState)).toEqual(expected);
    });
  });
});
