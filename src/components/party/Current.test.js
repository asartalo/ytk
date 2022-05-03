import React from 'react';
import { render, screen } from '@testing-library/react';
import queuedVideos from '../../fixtures/queuedVideos';
import { currentUser, profiles } from '../../fixtures/users';

import { setPlayback, skip } from '../../actions/partyActions';
import {
  standAlonePlayerOn,
  standAlonePlayerOff,
} from '../../actions/currentUserActions';
import { idToPlayerUrl } from '../../helpers/party';

import { Current } from './Current';
import userEvent from '@testing-library/user-event';

const currentVideo = {
  ...queuedVideos[0],
  isPlaying: false,
  at: 0.0,
};

describe('Current', () => {
  let props, rerender;
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
    rerender = render(<Current {...props} />).rerender;
  });

  describe('default state', () => {
    it('playback button is paused', () => {
      const playbackButton = screen.getByRole('button', { name: 'Play' });
      expect(playbackButton).toBeInTheDocument();
    });
  });

  describe('when playback button is clicked', () => {
    beforeEach(() => {
      const playbackButton = screen.getByRole('button', { name: 'Play' });
      userEvent.click(playbackButton);
    });

    it('calls dispatch to set playback', () => {
      expect(props.dispatch).toHaveBeenCalledWith(setPlayback(true));
    });
  });

  describe('when skip button is clicked', () => {
    beforeEach(() => {
      const skip = screen.getByRole('button', { name: 'Next' });
      userEvent.click(skip);
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
      button = screen.getByRole('button', { name: 'Open standalone player' });
      userEvent.click(button);
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
        const newProps = {
          ...props,
          dispatch: newDispatch,
          currentUser: { ...props.currentUser, standAlonePlayer: true },
        };
        rerender(<Current {...newProps} />);
        userEvent.click(button);
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
