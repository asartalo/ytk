import { ActionTypes as types } from '../constants';

export function setCurrentUserName(name) {
	return {
		type: types.CURRENT_USER_SET_NAME,
		data: name
	}
};
