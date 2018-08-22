import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

import userReducer from 'reducers/currentUser';
import partyReducer from 'reducers/party';
import ControlPanel from './ControlPanel';
import AppBar from './ControlPanel';
import { partyActions } from 'actions';

import PartyPage from './PartyPage';

describe('PartyPage', () => {
  let page, props, dispatch;

  const mountPage = () =>
    shallow(<PartyPage {...props} />, new ReactRouterEnzymeContext().get());

  beforeEach(() => {
    dispatch = jest.fn();
    props = {
      dispatch,
      currentUser: {
        ...userReducer(),
        name: 'Jane',
      },
      party: {
        ...partyReducer(),
        name: 'The Party',
        users: [{ name: 'Jane', uid: 'JID' }],
      },
    };
  });

  it('renders without crashing', () => {
    expect(mountPage()).toExist();
  });
});
