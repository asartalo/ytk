import React from 'react';

import { mountWithRouter } from '../../helpers/enzymeTest';

import ChooseParty from './ChooseParty';
import UserParties from './UserParties';

describe('ChooseParty', () => {
  let component, props;

  function mountUi() {
    return mountWithRouter(<ChooseParty {...props} />);
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

  it('does not render parties ui', () => {
    const parties = mountUi().find(UserParties);
    expect(parties).not.toExist();
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

  describe('when user has a party', () => {
    beforeEach(() => {
      props = { ...props, parties: ['a-party'] };
    });

    it('renders parties link', () => {
      const parties = mountUi().find(UserParties);
      expect(parties).toExist();
    });

    it('should pass parties prop to UserParties', () => {
      const parties = mountUi().find(UserParties);
      expect(parties).toHaveProp('parties', props.parties);
    });
  });
});
