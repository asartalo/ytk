/**
 * Combines all the reducers and exposes them as one data structure.
 */

import { combineReducers } from 'redux';

import error from './error';
import currentUser from './currentUser';
import { wrapReducers } from './firestore';
import db, { auth } from 'config/firebase';

export default combineReducers(
  wrapReducers(
    {
      currentUser,
      error,
    },
    db,
    auth
  )
);
