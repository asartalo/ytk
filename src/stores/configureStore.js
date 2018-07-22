import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple'

import rootReducer from '../reducers/index';
import devMiddlewares from './devMiddlewares';

const middlewares = [
	thunk
].concat(devMiddlewares);
middlewares.push(save());

const createStoreWithMiddleware
	= applyMiddleware(
			save() // Saving done here
	)(createStore);

const store = createStoreWithMiddleware(
	rootReducer,
	load()
);

export default store;
