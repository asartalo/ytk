import React from 'react';
import { mountWithRouter } from '../../helpers/enzymeTest';
import { profiles } from '../../fixtures/users';

import GroupButton from './GroupButton';
import PartyGoersMenu from './PartyGoersMenu';

import AppBarWithStyles, { AppBar } from './AppBar';

const commonProps = {
  classes: {},
  party: {
    name: 'The Party',
    users: profiles,
    queue: [],
    id: 'the-party-123',
  },
};

describe('AppBar', () => {
  let component, props;

  function mountBar() {
    return mountWithRouter(<AppBar {...props} />);
  }

  beforeEach(() => {
    props = {
      ...commonProps,
    };
    component = mountBar();
  });

  it('renders without crashing', () => {
    expect(component).toExist();
  });

  describe('PartyGoersMenu', () => {
    let menu;
    beforeEach(() => {
      menu = component.find(PartyGoersMenu);
    });

    it('is closed by default', () => {
      expect(menu).toHaveProp('open', false);
    });

    describe('when GroupButton is clicked', () => {
      beforeEach(() => {
        const button = component.find(GroupButton);
        button.simulate('click');
        menu = component.find(PartyGoersMenu);
      });

      it('opens PartyGoersMenu', () => {
        expect(menu).toHaveProp('open', true);
      });

      describe('and it is clicked again', () => {
        beforeEach(() => {
          const button = component.find(GroupButton);
          button.simulate('click');
          menu = component.find(PartyGoersMenu);
        });

        it('opens PartyGoersMenu', () => {
          expect(menu).toHaveProp('open', false);
        });
      });
    });
  });
});

describe('AppBarWithStyles', () => {
  let component, props;
  beforeEach(() => {
    props = { commonProps };
    component = mountWithRouter(<AppBarWithStyles {...props} />);
  });
});
