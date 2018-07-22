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

		it('blank intent', () => {
			expect(initialState.intent).toEqual('');
		});

		it('has blank party', () => {
			expect(initialState.party).toEqual('');
		});
	});

	it('noops for invalid action', () => {
		newState = currentUser(initialState, 'foo');
		expect(newState).toEqual(initialState);
	});

	it('handles CURRENT_USER_SET_NAME action', () => {
		const action = actions.setName('Jane');
		newState = currentUser(initialState, action);
		expect(newState.name).toEqual('Jane');
	});

	it('handles CURRENT_USER_SET_NAME_AND_INTENT action', () => {
		const action = actions.setNameAndIntent('John', 'start');
		newState = currentUser(initialState, action);
		expect(newState.name).toEqual('John');
		expect(newState.intent).toEqual('start');
	});

	it('handles CURRENT_USER_SET_PARTY action', () => {
		const action = actions.setParty('My Party');
		newState = currentUser(initialState, action);
		expect(newState.party).toEqual('My Party');
	});
});
