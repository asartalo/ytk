import { ActionTypes as types } from '../constants';
import db, { auth } from 'config/firebase';

export function signInAnonymouslyStart() {
	return {
		type: types.FIRESTORE_SIGN_IN_ANONYMOUSLY_START
	};
};

export function signInAnonymouslySuccess(response) {
	return {
		type: types.FIRESTORE_SIGN_IN_ANONYMOUSLY_SUCCESS,
		data: response
	};
};

export function signInAnonymouslyError(error) {
	return {
		type: types.FIRESTORE_SIGN_IN_ANONYMOUSLY_ERROR,
		data: error
	}
};

function dis(dispatch, action) {
	return (...args) => {
		dispatch(action(...args));
	}
}

export function signInAnonymously(currentUser) {
	return async dispatch => {
		dispatch(signInAnonymouslyStart());
		let response;
		try {
			response = await auth.signInAnonymously();
			dispatch(signInAnonymouslySuccess(response));
			dispatch(retrieveUserData(currentUser, response.user.uid));
		} catch(error) {
			dispatch(signInAnonymouslyError(error));
		};
	}
};


let usersRef;
function usersCollection() {
	if (!usersRef) {
		usersRef = db.collection('users');
	}
	return usersRef;
}

let currentUserRef;
function currentUser(uid) {
	if (currentUserRef) return currentUserRef;
	if (!uid) throw Error("No UID SET");
	currentUserRef = usersCollection().doc(uid);
	return currentUserRef;
}

export function getUserData(uid) {
	return {
		type: types.FIRESTORE_GETTING_USER_DATA,
		data: { uid }
	}
}

export function getUserDataError(error) {
	return {
		type: types.FIRESTORE_GETTING_USER_DATA_ERROR,
		data: error
	};
};

export function getUserDataSuccess(data) {
	return {
		type: types.FIRESTORE_GETTING_USER_DATA_SUCCESS,
		data,
	};
};

export function userDataDoesNotExist(doc) {
	return {
		type: types.FIRESTORE_USER_DATA_DOES_NOT_EXIST,
		data: doc
	};
};

export function retrieveUserData(user, uid) {
	return async dispatch => {
		dispatch(getUserData(uid));
		let doc;
		try {
			doc = await currentUser(uid).get();
		} catch (e) {
			dispatch(getUserDataError(e));
			return;
		}
		if (doc.exists) {
			// load the data
			dispatch(getUserDataSuccess(doc.data()));
		} else {
			// set new data
			dispatch(userDataDoesNotExist(doc));
			saveUser(user, uid);
		}
	}
};

export function saveUserStart(user, uid) {
	return {
		type: types.FIRESTORE_SAVE_USER_DATA,
		data: { user, uid },
	};
}

export function saveUserError(error) {
	return {
		type: types.FIRESTORE_SAVE_USER_DATA_ERROR,
		data: error,
	};
}

export function saveUser(user, uid) {
	return async dispatch => {
		dispatch(saveUserStart(user, uid));
		currentUser(uid).set(user).catch(dis(dispatch, saveUserError));
	}
}

