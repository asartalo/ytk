import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';

import mockStore from '../../helpers/mockStore';
import { currentUser } from '../../fixtures/users';
import partyReducer from '../../reducers/party';

import { ControlPanel } from './ControlPanel';

jest.useFakeTimers();
describe('ControlPanel', () => {
  let component, props, store, wrapper;

  function mountPanel() {
    store = mockStore();
    return mount(
      <Provider store={store}>
        <ControlPanel {...props} />
      </Provider>
    );
  }

  beforeEach(() => {
    props = {
      classes: {},
      showAddMenu: false,
      currentUser: { ...currentUser, name: 'Jhon' },
      party: { ...partyReducer(undefined, {}) },
      onChangePanel: jest.fn(),
      onToggleMenu: jest.fn(),
    };
    wrapper = mountPanel();
    component = wrapper.find(ControlPanel);
  });

  it('renders without crashing', () => {
    expect(mountPanel()).toExist();
  });

  it('shows Queue by default', () => {
    const swipe = component.find(SwipeableViews);
    expect(swipe).toHaveProp('index', 0);
  });

  Object.entries({
    handleChangePanel: 'onChangePanel',
    handleToggleMenu: 'onToggleMenu',
    handleAddToQueue: 'onToggleMenu',
  }).forEach(([event, handler]) => {
    describe(`calling ${event}`, () => {
      beforeEach(() => {
        component.instance()[event]();
      });

      it(`calls ${handler}`, () => {
        expect(props[handler]).toHaveBeenCalled();
      });
    });
  });

  describe.skip('when showAddMenu is true', () => {
    beforeEach(() => {
      props.showAddMenu = true;
      wrapper = mountPanel();
      component = wrapper.find(ControlPanel);
      jest.runOnlyPendingTimers();
    });

    it('shows AddToQueue', () => {
      const swipe = component.find(SwipeableViews);
      expect(swipe).toHaveProp('index', 1);
    });

    it('focuses on search field', () => {
      expect(document.activeElement).toEqual(component.instance().searchInput);
    });
  });
});
