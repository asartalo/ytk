import React from 'react';

import { shallowWithRouter } from 'helpers/enzymeTest';

import userReducer from 'reducers/currentUser';
import partyReducer from 'reducers/party';
import staticVideoData from 'fixtures/staticVideoData';
import { partyActions } from 'actions';
import ConnectedPlayer from './ConnectedPlayer';

import PartyPageWithStyle, { PartyPage } from './PartyPage';

const sampleVideo = staticVideoData[0];

const defaultProps = {
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
  classes: {
    emptyQueueHelp: 'emptyQueueHelp',
  },
};

describe('PartyPage', () => {
  let page, props;

  const mountPage = () => shallowWithRouter(<PartyPage {...props} />);

  beforeEach(() => {
    props = { ...defaultPropsNaked, dispatch: jest.fn() };
    page = mountPage();
  });

  it('sets showAddmenu to true when there is no current and queue is empty', () => {
    expect(page.instance().state.showAddMenu).toBe(true);
  });

  it('does not show a player as there is no current video', () => {
    const player = page.find(ConnectedPlayer);
    expect(player).not.toExist();
  });

  it('renders help text for empty queue', () => {
    const help = page.find('.emptyQueueHelp');
    expect(help).toExist();
  });

  describe('when there is current item on party', () => {
    const setCurrent = current => ({
      ...props,
      party: {
        ...props.party,
        current: {
          ...sampleVideo,
          addedBy: 'JID',
          queueId: 'FOO-bar-18388',
          isPlaying: false,
          at: 0.0,
          ...current,
        },
      },
    });

    beforeEach(() => {
      props = setCurrent({});
      page = mountPage();
    });

    it('sets showAddMenu to false', () => {
      expect(page.instance().state.showAddMenu).toBe(false);
    });

    it('does not render help text for empty queue', () => {
      const help = page.find('.emptyQueueHelp');
      expect(help).not.toExist();
    });

    describe('rendered ConnectedPlayer', () => {
      let player;
      beforeEach(() => {
        player = page.find(ConnectedPlayer);
      });

      it('renders a video player', () => {
        expect(player).toExist();
      });
    });
  });
});

describe('PartyPageWithStyles', () => {
  let page, props;

  const mountPage = () => shallowWithRouter(<PartyPageWithStyle {...props} />);

  beforeEach(() => {
    props = { ...defaultProps, dispatch: jest.fn() };
    page = mountPage();
  });

  it('renders without crashing', () => {
    expect(page).toExist();
  });
});
