import React from 'react';
import { mount } from 'enzyme';

import ChooseParty from './ChooseParty';

describe('ChooseParty', () => {
  let component, props;

  function mountUi() {
    return mount(<ChooseParty {...props} />);
  }

  beforeEach(() => {
    props = {
      userName: 'John',
      onSetIntent: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    expect(mountUi()).toExist();
  });

  it('should show user name', () => {
    expect(mountUi()).toIncludeText('John');
  });

  it('should show Join a Party Button', () => {
    const button = mountUi().find('button[value="join"]');
    expect(button).toExist();
  });

  it('should show Start a Party Button', () => {
    const button = mountUi().find('button[value="start"]');
    expect(button).toExist();
  });

  describe('when Join button is clicked', () => {
    beforeEach(() => {
      const button = mountUi().find('button[value="join"]');
      button.simulate('click');
    });

    it('calls onSetIntent with "join" value', () => {
      expect(props.onSetIntent).toHaveBeenCalledWith('join');
    });
  });

  describe('when Start button is clicked', () => {
    beforeEach(() => {
      const button = mountUi().find('button[value="start"]');
      button.simulate('click');
    });

    it('calls onSetIntent with "start" value', () => {
      expect(props.onSetIntent).toHaveBeenCalledWith('start');
    });
  });
});
