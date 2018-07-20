import { ActionTypes as types } from '../constants';

const defaultState = {
	name: ''
};

export default function currentUser(state = defaultState, action = {  }) {
	if (!action.type) {
		return state;
	}

	switch (action.type) {
		case types.CURRENT_USER_SET_NAME:
			return {
				...state,
				name: action.data
			};
		default:
			return state;
	}
};
