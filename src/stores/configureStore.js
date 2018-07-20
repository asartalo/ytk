import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

import devMiddlewares from './devMiddlewares';

const middlewares = [
	thunk
].concat(devMiddlewares);

const store = createStore(
	rootReducer,
	applyMiddleware(...middlewares)
);

export default store;
