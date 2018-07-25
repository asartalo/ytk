import { ActionTypes as types } from '../constants';

export function setName(name) {
	return {
		type: types.CURRENT_USER_SET_NAME,
		data: name
	};
};

export function setNameAndIntent(name, intent) {
	return {
		type: types.CURRENT_USER_SET_NAME_AND_INTENT,
		data: { name, intent }
	}
};

export function setParty(partyId) {
	return {
		type: types.CURRENT_USER_SET_PARTY,
		data: partyId
	};
};

export function setHomeState(state) {
	return {
		type: types.CURRENT_USER_UI_HOME_SET_STATE,
		data: state,
	};
};

