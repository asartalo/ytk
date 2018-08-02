/**
 * Combines all the reducers and exposes them as one data structure.
 */

import { combineReducers } from 'redux';

import error from './error';
import currentUser from './currentUser';
import party from './party';
import firestore from './firestore';

export default combineReducers({ currentUser, firestore, error, party });
