import React from 'react';
import { mount } from 'enzyme';
import searchResults from 'fixtures/staticVideoData';
import queuedVideos from 'fixtures/queuedVideos';
import { currentUser, profiles } from 'fixtures/users';

import { setPlayback, skip } from 'actions/partyActions';
import {
  standAlonePlayerOn,
  standAlonePlayerOff,
} from 'actions/currentUserActions';
import PlaybackButton from './PlaybackButton';
import SkipButton from './SkipButton';
import StandaloneButton from './StandaloneButton';
import { idToPlayerUrl } from 'helpers/party';

import { Current } from './Current';

const currentVideo = {
  ...queuedVideos[0],
  isPlaying: false,
  at: 0.0,
};

describe('Current', () => {
  let component, props;
  beforeEach(() => {
    props = {
      classes: {},
      current: { ...currentVideo },
      currentUser: {
        ...currentUser,
        party: 'the-party-9832',
      },
      users: [...profiles],
      dispatch: jest.fn(),
      queue: queuedVideos.slice(1),
    };
  });

  beforeEach(() => {
    component = mount(<Current {...props} />);
  });

  describe('default state', () => {
    it('renders without crashing', () => {
      expect(component).toExist();
    });

    it('playback button is paused', () => {
      const playbackButton = component.find(PlaybackButton);
      expect(playbackButton).toHaveProp('isPlaying', false);
    });
  });

  describe('when playback button is clicked', () => {
    beforeEach(() => {
      const playbackButton = component.find(PlaybackButton);
      playbackButton.simulate('click');
    });

    it('calls dispatch to set playback', () => {
      expect(props.dispatch).toHaveBeenCalledWith(setPlayback(true));
    });
  });

  describe('when skip button is clicked', () => {
    beforeEach(() => {
      const skip = component.find(SkipButton);
      skip.simulate('click');
    });

    it('calls dispatch to set playback', () => {
      expect(props.dispatch).toHaveBeenCalledWith(
        skip({
          from: props.current.queueId,
          to: props.queue[0].queueId,
        })
      );
    });
  });

  describe('when standalone button is clicked', () => {
    let oldOpen, button, opened;

    beforeEach(() => {
      oldOpen = global.open;
      opened = { close: jest.fn() };
      global.open = jest.fn(() => opened);
      button = component.find(StandaloneButton);
      button.simulate('click');
    });

    afterEach(() => {
      global.open = oldOpen;
    });

    it('opens standalone player', () => {
      expect(global.open).toHaveBeenCalledWith(
        idToPlayerUrl('the-party-9832'),
        `Okee ${props.currentUser.name}`
      );
    });

    it('dispatches standalonePlayer action', () => {
      expect(props.dispatch).toHaveBeenCalledWith(standAlonePlayerOn());
    });

    it('does not dispatch standalonePlayer off action', () => {
      expect(props.dispatch).not.toHaveBeenCalledWith(standAlonePlayerOff());
    });

    describe('when standalonePlayer is on and button is clicked', () => {
      let newDispatch;
      beforeEach(() => {
        global.open = jest.fn(() => opened);
        newDispatch = jest.fn();
        component.setProps({
          dispatch: newDispatch,
          currentUser: { ...props.currentUser, standAlonePlayer: true },
        });
        component.update();
        button.simulate('click');
      });

      it('dispatches standalonePlayer off action', () => {
        expect(newDispatch).toHaveBeenCalledWith(standAlonePlayerOff());
      });

      it('does not dispatch standalonePlayer on action', () => {
        expect(newDispatch).not.toHaveBeenCalledWith(standAlonePlayerOn());
      });

      it('closes standalone player', () => {
        expect(opened.close).toHaveBeenCalled();
      });

      it('does not open standalone player', () => {
        expect(global.open).not.toHaveBeenCalled();
      });
    });
  });
});
