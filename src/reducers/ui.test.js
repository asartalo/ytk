import * as actions from '../actions/uiActions';
import ui from './ui';

describe('ui actions', () => {
	let initialState, newState;

	beforeEach(() => {
		initialState = ui();
	});

	describe('default state', () => {
		it('has "start" homeState value', () => {
			expect(initialState.homeState).toEqual('start');
		});
	});

	it('noops for invalid action', () => {
		newState = ui(initialState, 'foo');
		expect(newState).toEqual(initialState);
	});

	it('handles UI_HOME_SET_STATE', () => {
		const action = actions.setHomeState('inputStarted');
		newState = ui(initialState, action);
		expect(newState.homeState).toEqual('inputStarted');
	});
});
