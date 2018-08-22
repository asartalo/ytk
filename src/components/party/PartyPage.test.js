import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

import userReducer from 'reducers/currentUser';
import partyReducer from 'reducers/party';
import staticQueueData from 'components/party/staticQueueData';
import { partyActions } from 'actions';

import PartyPageWithStyle, { PartyPage } from './PartyPage';

const sampleVideo = staticQueueData[0];

const defaultProps = {
  dispatch: jest.fn(),
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

const defaultPropsNaked = {
  ...defaultProps,
  classes: {},
};

describe('PartyPageWithStyles', () => {
  let page, props;

  const mountPage = () =>
    shallow(
      <PartyPageWithStyle {...props} />,
      new ReactRouterEnzymeContext().get()
    );

  beforeEach(() => {
    props = { ...defaultProps };
    page = mountPage();
  });

  it('renders without crashing', () => {
    expect(page).toExist();
  });
});

describe('PartyPageWithStyles', () => {
  let page, props;

  const mountPage = () =>
    shallow(<PartyPage {...props} />, new ReactRouterEnzymeContext().get());

  beforeEach(() => {
    props = { ...defaultPropsNaked };
    page = mountPage();
  });

  it('sets showAddmenu to true when there is no current and queue is empty', () => {
    expect(page.instance().state.showAddMenu).toBe(true);
  });

  describe('when there is current item on party', () => {
    beforeEach(() => {
      props = {
        ...defaultPropsNaked,
        party: {
          ...defaultPropsNaked.party,
          current: {
            ...sampleVideo,
            addedBy: 'JID',
            queueId: 'FOO-bar-18388',
          },
        },
      };
      page = mountPage();
    });

    it('sets showAddMenu to false', () => {
      expect(page.instance().state.showAddMenu).toBe(false);
    });
  });
});
