import { ActionTypes as types } from '../constants';

export function setHomeState(state) {
	return {
		type: types.UI_HOME_SET_STATE,
		data: state,
	};
};
