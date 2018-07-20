import React from 'react';
import { mount } from 'enzyme';
import NameForm from './NameForm';

describe('NameForm', () => {
	let form, props;
	beforeEach(() => {
		props = {
			onNameSet: jest.fn()
		};
		form = mount(<NameForm {...props} />);
	});

	it('disables submit button by default', () => {
		const button = form.find('button[type="submit"]');
		expect(button.prop('disabled')).toBe(true);
	});

	describe('when the name is set', () => {
		beforeEach(() => {
			form
				.find('input[name="current-user-name"]')
				.simulate('change', { target: { value: "Someone" } });
		});

		it('enables submit button', () => {
			const button = form.find('button[type="submit"]');
			expect(button.prop('disabled')).toBe(false);
		});

		it('calls onNameSet when form is submitted', () => {
			form.find('form').simulate('submit');
			expect(props.onNameSet).toHaveBeenCalledWith("Someone");
		});
	});
});
