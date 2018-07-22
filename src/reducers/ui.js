import { ActionTypes as types } from '../constants';

const defaultState = {
	homeState: 'start',
};

export default function ui(state = defaultState, action = {  }) {
	switch (action.type) {
		case types.UI_HOME_SET_STATE:
			return {
				...state,
				homeState: action.data,
			};
		default:
			return state;
	}
};
