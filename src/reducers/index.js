/**
 * Combines all the reducers and exposes them as one data structure.
 */

import { combineReducers } from 'redux';

import error from './error';
import currentUser from './currentUser';
import ui from './ui';

export default combineReducers({
  currentUser,
  ui,
  error
});

