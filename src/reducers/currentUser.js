import { ActionTypes as types } from '../constants';

const defaultState = {
	name: '',
	intent: '',
	party: '',
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
		case types.CURRENT_USER_SET_NAME_AND_INTENT:
			return {
				...state,
				name: action.data.name,
				intent: action.data.intent,
			};
		case types.CURRENT_USER_SET_PARTY:
			return {
				...state,
				party: action.data
			};
		default:
			return state;
	}
};
