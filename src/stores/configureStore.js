import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers/index';

// Middlewares
import devMiddlewares from './devMiddlewares';
import createSagaMiddleware from 'redux-saga';
import db, { auth } from '../config/firebase.js';
import YtkFire from '../YtkFire';
import ytSearch from '../ytSearch';
import prepareSagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware].concat(devMiddlewares);

const store = createStore(rootReducer, applyMiddleware(...middlewares));

const { rootSaga } = prepareSagas(new YtkFire(db, auth), ytSearch);
sagaMiddleware.run(rootSaga);

export default store;
