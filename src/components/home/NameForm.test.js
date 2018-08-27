import React from 'react';
import { mount } from 'enzyme';
import NameForm from './NameForm';

describe('NameForm', () => {
  let form, props;
  beforeEach(() => {
    props = {
      onNameSet: jest.fn(),
      onInputStarted: jest.fn(),
    };
    form = mount(<NameForm {...props} />);
  });

  it('disables submit buttons by default', () => {
    const buttons = form.find('button[type="submit"]');
    buttons.forEach(button => {
      expect(button.prop('disabled')).toBe(true);
    });
  });

  describe('when the name field is focused', () => {
    let input;
    beforeEach(() => {
      input = form.find('input[name="current-user-name"]');
      input.simulate('focus');
    });

    it('calls onInputStarted', () => {
      expect(props.onInputStarted).toHaveBeenCalled();
    });

    it('does not call onInputStarted when input is focused again', () => {
      input.simulate('focus');
      expect(props.onInputStarted).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the name is set', () => {
    beforeEach(() => {
      form
        .find('input[name="current-user-name"]')
        .simulate('change', { target: { value: 'Someone' } });
    });

    it('enables submit button', () => {
      const buttons = form.find('button[type="submit"]');
      buttons.forEach(button => {
        expect(button.prop('disabled')).toBe(false);
      });
    });

    it('calls onNameSet when that button is clicked', () => {
      form.find('button[type="submit"]').simulate('click');
      expect(props.onNameSet).toHaveBeenCalledWith('Someone');
    });

    it('calls onNameSet when regular submit is done (pressing enter)', () => {
      form.simulate('submit');
      expect(props.onNameSet).toHaveBeenCalledWith('Someone');
    });
  });
});
