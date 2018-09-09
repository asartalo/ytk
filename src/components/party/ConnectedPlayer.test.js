import React from 'react';
import { shallow } from 'enzyme';

import { setPlayback, setCurrentAt, skip } from 'actions/partyActions';
import { ConnectedPlayer } from './ConnectedPlayer';
import Player from 'components/video/Player';
import videos from 'fixtures/queuedVideos';

const currentVideoTemplate = {
  ...videos[0],
  isPlaying: false,
  at: 0.0,
};

describe('ConnectedPlayer', () => {
  let component, props, instance, playerObj;

  function mountComponent() {
    return shallow(<ConnectedPlayer {...props} />);
  }

  const playerPaused = () => {
    component = mountComponent();
    instance = component.instance();
    instance.handleReady(playerObj);
  };

  const playerPlaying = () => {
    props = { ...props, isPlaying: true };
    component = mountComponent();
    instance = component.instance();
    instance.handleReady(playerObj);
  };

  beforeEach(() => {
    props = {
      videoId: currentVideoTemplate.videoId,
      at: currentVideoTemplate.at,
      isPlaying: currentVideoTemplate.isPlaying,
      className: 'playerClass',
      dispatch: jest.fn(),
      current: 'currentId',
      next: 'nextId',
    };
  });

  it('renders without crashing', () => {
    expect(mountComponent()).toExist();
  });

  describe('Player', () => {
    let player, instance;
    beforeEach(() => {
      component = mountComponent();
      instance = component.instance();
      player = component.find(Player);
    });

    it('renders a Player', () => {
      expect(player).toExist();
    });

    // Player properties
    Object.entries({
      videoId: () => props.videoId,
      className: 'playerClass',
      start: 0.0,
      onPlay: () => instance.handlePlay,
      onReady: () => instance.handleReady,
      onPause: () => instance.handlePause,
      onEnd: () => instance.handleEnd,
      onStateChange: () => instance.handleStateChange,
    }).forEach(([prop, value]) => {
      it(`assigns '${prop}' of Player`, () => {
        expect(player).toHaveProp(
          prop,
          typeof value === 'function' ? value() : value
        );
      });
    });
  });

  describe('playback', () => {
    let player;
    beforeEach(() => {
      playerObj = {
        playVideo: jest.fn(),
        pauseVideo: jest.fn(),
        getCurrentTime: jest.fn(),
        seekTo: jest.fn(() => playerObj),
      };
    });

    describe('when ready and the video is set to play', () => {
      beforeEach(() => {
        props = { ...props, isPlaying: true, at: 1.3 };
        component = mountComponent();
        component.instance().handleReady(playerObj);
      });

      it('plays video', () => {
        expect(playerObj.playVideo).toHaveBeenCalled();
      });

      it('does not pause video', () => {
        expect(playerObj.pauseVideo).not.toHaveBeenCalled();
      });

      describe('when props is updated to be paused', () => {
        beforeEach(() => {
          const prevProps = { ...props };
          const instance = component.instance();
          instance.props = { ...props, isPlaying: false, at: 2.8 };
          instance.componentDidUpdate(prevProps);
        });

        it('pauses video', () => {
          expect(playerObj.pauseVideo).toHaveBeenCalled();
        });
      });

      describe('when props is updated but playback did not change', () => {
        beforeEach(() => {
          const prevProps = { ...props };
          const instance = component.instance();
          instance.componentDidUpdate(prevProps);
        });

        it('does not call play video', () => {
          expect(playerObj.playVideo).not.toHaveBeenCalledTimes(2);
        });

        it('does not pause video', () => {
          expect(playerObj.pauseVideo).not.toHaveBeenCalled();
        });
      });
    });

    describe('when ready and the video is set to pause', () => {
      beforeEach(() => {
        props = { ...props, isPlaying: false, at: 4.6 };
        component = mountComponent();
        component.instance().handleReady(playerObj);
      });

      it('pauses video', () => {
        expect(playerObj.pauseVideo).toHaveBeenCalled();
      });

      it('does not play video', () => {
        expect(playerObj.playVideo).not.toHaveBeenCalled();
      });

      describe('when props is updated to be played', () => {
        beforeEach(() => {
          const prevProps = { ...props };
          const instance = component.instance();
          instance.props = { ...props, isPlaying: true, at: 4.6 };
          instance.componentDidUpdate(prevProps);
        });

        it('plays video', () => {
          expect(playerObj.playVideo).toHaveBeenCalled();
        });
      });

      describe('when props is updated but playback did not change', () => {
        beforeEach(() => {
          const prevProps = { ...props };
          const instance = component.instance();
          instance.componentDidUpdate(prevProps);
        });

        it('does not call pause video', () => {
          expect(playerObj.pauseVideo).not.toHaveBeenCalledTimes(2);
        });

        it('does not call to play video', () => {
          expect(playerObj.playVideo).not.toHaveBeenCalled();
        });
      });
    });

    describe('Events', () => {
      describe('Pause', () => {
        describe('when paused', () => {
          beforeEach(() => {
            playerPaused();
            instance.handlePause(8.0);
          });

          it('does not dispatch playback actions', () => {
            expect(props.dispatch).not.toHaveBeenCalledWith(setPlayback(false));
          });

          it('dispatches setCurrentAt action', () => {
            expect(props.dispatch).toHaveBeenCalledWith(setCurrentAt(8.0));
          });
        });

        describe('when playing', () => {
          beforeEach(() => {
            playerPlaying();
            instance.handlePause(8.0);
          });

          it('dispatches playback actions', () => {
            expect(props.dispatch).toHaveBeenCalledWith(setCurrentAt(8.0));
            expect(props.dispatch).toHaveBeenCalledWith(setPlayback(false));
          });
        });
      });

      describe('Play', () => {
        describe('when paused', () => {
          beforeEach(() => {
            playerPaused();
            instance.handlePlay(7.0);
          });

          it('dispatches setPlayback action', () => {
            expect(props.dispatch).toHaveBeenCalledWith(setCurrentAt(7.0));
            expect(props.dispatch).toHaveBeenCalledWith(setPlayback(true));
          });
        });

        describe('when playing', () => {
          beforeEach(() => {
            playerPlaying();
            instance.handlePlay(6.0);
          });

          it('does not dispatch setPlayback action', () => {
            expect(props.dispatch).not.toHaveBeenCalledWith(setPlayback(true));
          });

          it('dispatches setCurrentAt action', () => {
            expect(props.dispatch).toHaveBeenCalledWith(setCurrentAt(6.0));
          });
        });
      });

      describe('End', () => {
        beforeEach(() => {
          playerPaused();
          instance.handleEnd(playerObj);
        });

        it('dispatches skip action', () => {
          expect(props.dispatch).toHaveBeenCalledWith(
            skip({
              from: props.current,
              to: props.next,
            })
          );
        });
      });

      describe('StateChange', () => {
        describe('when playerState is play ... or something else', () => {
          beforeEach(() => {
            playerPlaying();
            playerObj.playVideo = jest.fn(); // Reset mock
            instance.handleStateChange('playing');
          });

          it('does nothing', () => {
            expect(playerObj.playVideo).not.toHaveBeenCalled();
          });
        });

        describe('when playerState is unstarted and is currently playing', () => {
          beforeEach(() => {
            playerPlaying();
            instance.handleStateChange('unstarted');
          });

          it('means we loaded something so play', () => {
            expect(playerObj.playVideo).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Pausing and Skipping', () => {
    let playerComponent;
    beforeEach(() => {
      props = { ...props, at: 3.0 };
      playerPlaying();
      playerComponent = component.find(Player);
    });

    it('passes at to Player component', () => {
      expect(playerComponent).toHaveProp('start', 3.0);
    });

    describe('when the at prop is modified', () => {
      beforeEach(() => {
        component.setProps({ at: 8.0 });
      });

      it('does not pass new at to Player', () => {
        expect(component.find(Player).prop('start')).toEqual(3.0);
      });
    });

    describe('when the videoId and at prop is changed ', () => {
      beforeEach(() => {
        component.setProps({ at: 9.0, videoId: 'somethingElse' });
      });

      it('passes new at to Player', () => {
        expect(component.find(Player).prop('start')).toEqual(9.0);
      });

      describe('when player pauses', () => {
        beforeEach(() => {
          component.instance().handlePause();
        });

        it('must not dispatch a pause action', () => {
          expect(props.dispatch).not.toHaveBeenCalledWith(setPlayback(false));
        });
      });

      describe('when player plays and then pauses', () => {
        beforeEach(() => {
          component.instance().handlePlay();
          component.instance().handlePause();
        });

        it('can dispatch pause action', () => {
          expect(props.dispatch).toHaveBeenCalledWith(setPlayback(false));
        });
      });
    });
  });
});
