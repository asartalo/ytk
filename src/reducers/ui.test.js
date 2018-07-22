import * as actions from '../actions/uiActions';
import ui from './ui';

describe('ui actions', () => {
	let initialState, newState;

	beforeEach(() => {
		initialState = ui();
	});

	it('handle UI_HOME_SET_STATE', () => {
		const action = actions.setHomeState('inputStarted');
		newState = ui(initialState, action);
		expect(newState.homeState).toEqual('inputStarted');
	});
});
