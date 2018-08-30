import rootReducer from '../reducers/index';

export default function mockStore() {
  let state = rootReducer(undefined, {});
  const dispatchedActions = [];

  const store = {
    subscribe: () => {},
    unsubscribe: () => {},
    dispatch: jest.fn(action => {
      dispatchedActions.push(action);
      state = rootReducer(state, action);
    }),
    getState: jest.fn(() => state),
  };

  return store;
}
