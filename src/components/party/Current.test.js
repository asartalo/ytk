import React from 'react';
import { mount } from 'enzyme';
import searchResults from 'fixtures/staticVideoData';
import queuedVideos from 'fixtures/queuedVideos';
import { currentUser, profiles } from 'fixtures/users';

import { setPlayback, skip } from 'actions/partyActions';
import PlaybackButton from './PlaybackButton';
import SkipButton from './SkipButton';

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
      currentUser: { ...currentUser },
      users: [...profiles],
      dispatch: jest.fn(),
    };
  });

  describe('default state', () => {
    beforeEach(() => {
      component = mount(<Current {...props} />);
    });

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
      component = mount(<Current {...props} />);
      const playbackButton = component.find(PlaybackButton);
      playbackButton.simulate('click');
    });

    it('calls dispatch to set playback', () => {
      expect(props.dispatch).toHaveBeenCalledWith(setPlayback(true));
    });
  });

  describe('when skip button is clicked', () => {
    beforeEach(() => {
      component = mount(<Current {...props} />);
      const skip = component.find(SkipButton);
      skip.simulate('click');
    });

    it('calls dispatch to set playback', () => {
      expect(props.dispatch).toHaveBeenCalledWith(skip());
    });
  });
});
