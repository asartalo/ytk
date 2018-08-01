/**
 * Combines all the reducers and exposes them as one data structure.
 */

import { combineReducers } from 'redux';

import db, { auth } from 'config/firebase';

import error from './error';
import currentUser from './currentUser';
import party from './party';
import { wrapReducers } from './firestore';

export default combineReducers(
  wrapReducers({ currentUser, error, party }, db, auth)
);
