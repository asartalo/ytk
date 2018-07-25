import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers/index';

// Middlewares
import thunk from 'redux-thunk';
import devMiddlewares from './devMiddlewares';

const middlewares = [thunk].concat(devMiddlewares);

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
