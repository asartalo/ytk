/**
 * Combines all the reducers and exposes them as one data structure.
 */

import { combineReducers } from 'redux';

import error from './error';
import currentUser from './currentUser';
import party from './party';
import firestore from './firestore';
import ui from './ui';

export const basicReducers = () =>
  combineReducers({
    currentUser,
    error,
    party,
    ui,
  });

export default combineReducers({
  currentUser,
  firestore,
  error,
  party,
  ui,
});
