import currentUser from './currentUser';
import * as actions from '../actions/currentUserActions';

describe('currentUser', () => {
	let initialState, newState;

	beforeEach(() => {
		initialState = currentUser();
	});

	describe('default state', () => {
		it('defaults to blank name', () => {
			expect(initialState.name).toEqual('');
		});
	});

	it('sets name when CURRENT_USER_SET_NAME action is received', () => {
		const action = actions.setCurrentUserName('Jane');
		newState = currentUser(initialState, action);
		expect(newState.name).toEqual('Jane');
	});
});
