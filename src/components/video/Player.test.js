import React from 'react';
import { mount } from 'enzyme';
import capitalize from 'voca/capitalize';

import YouTube from 'react-youtube';

import PlayerWithStyles, { Player } from './Player';

describe('Player', () => {
  let component, props;

  function mountPlayer() {
    return mount(<Player {...props} />);
  }

  beforeEach(() => {
    props = {
      videoId: 'someIDOfVideo',
      classes: { rootWide: 'rootWideClass' },
      className: 'rootElement',
      start: 2.2,
    };
  });

  it('renders without crashing', () => {
    expect(mountPlayer()).toExist();
  });

  it('passes videoId prop to YouTube', () => {
    const youtubeComponent = mountPlayer().find(YouTube);
    expect(youtubeComponent).toHaveProp('videoId', props.videoId);
  });

  it('defaults to no rootWide class', () => {
    const root = mountPlayer().find('div.rootElement');
    expect(root.hasClass('rootWideClass')).toBe(false);
  });

  it('passes start as number of seconds to YouTube playerVars', () => {
    const youtubeComponent = mountPlayer().find(YouTube);
    expect(youtubeComponent.prop('opts')).toMatchObject({
      playerVars: { start: 2 },
    });
  });

  describe('when wideRatio is set', () => {
    beforeEach(() => {
      props = {
        ...props,
        wideRatio: true,
      };
    });

    it('renders rootWide class', () => {
      const root = mountPlayer().find('div.rootElement');
      expect(root.hasClass('rootWideClass')).toBe(true);
    });
  });

  describe('player events', () => {
    let event, ytPlayer, instance;
    beforeEach(() => {
      event = {
        data: -1,
        target: { getCurrentTime: jest.fn(() => 1.1) },
      };
      props = {
        ...props,
        onPlay: jest.fn(),
        onPause: jest.fn(),
        onReady: jest.fn(),
        onEnd: jest.fn(),
        onStateChange: jest.fn(),
      };
      component = mountPlayer();
      instance = component.instance();
      ytPlayer = component.find(YouTube);
    });

    Object.entries({
      play: 1.1,
      pause: 1.1,
      ready: () => event.target,
      end: () => event.target,
      stateChange: 'unstarted',
    }).forEach(([type, arg]) => {
      const capType = capitalize(type);
      describe(`on${capType}()`, () => {
        it(`assigns handle${capType} to YT on${capType}`, () => {
          expect(ytPlayer).toHaveProp(
            `on${capType}`,
            instance[`handle${capType}`]
          );
        });

        it(`calls on${capType} prop when handle${capType} is called`, () => {
          instance[`handle${capType}`](event);
          expect(props[`on${capType}`]).toHaveBeenCalledWith(
            typeof arg === 'function' ? arg() : arg
          );
        });
      });
    });
  });
});
