import React from 'react';

import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { createMocks } from 'react-idle-timer';

import userReducer from '../../reducers/currentUser';
import partyReducer from '../../reducers/party';
import staticVideoData from '../../fixtures/staticVideoData';

import PartyPlayerPageWithStyle, { PartyPlayerPage } from './PartyPlayerPage';
import { addToQueue } from '../../actions/partyActions';
import { createStore } from 'redux';
import { basicReducers } from '../../reducers';

const sampleVideo = staticVideoData[0];

const defaultProps = {
  currentUser: {
    ...userReducer(),
    name: 'Jane',
    standAlonePlayer: true,
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
    noVideoHelp: 'noVideoHelp',
    controls: 'controls',
    mainButton: 'mainButton',
    invisible: 'invisible',
  },
};

describe('PartyPlayerPage', () => {
  let page, props, store, oldAddEventListener, instance, renderResult;

  const element = () => {
    return (
      <Provider store={store}>
        <PartyPlayerPage {...props} />
      </Provider>
    );
  };

  const mountPage = () => {
    renderResult = render(element());
    return renderResult;
  };

  beforeEach(() => {
    store = createStore(basicReducers());
    oldAddEventListener = global.addEventListener;
    global.addEventListener = jest.fn();
    props = {
      ...defaultPropsNaked,
      dispatch: jest.fn(),
      screenfull: {
        enabled: true,
        on: jest.fn(),
        toggle: jest.fn(),
      },
      signal: {
        send: jest.fn(),
      },
      ref: node => {
        instance = node;
      },
    };
    mountPage();
  });

  afterEach(() => {
    global.addEventListener = oldAddEventListener;
  });

  it('does not show a player as there is no current video', () => {
    const player = screen.queryByTestId('Player');
    expect(player).not.toBeInTheDocument();
  });

  it('renders help text for no video', () => {
    const help = document.querySelector('.noVideoHelp');
    expect(help).toBeInTheDocument();
  });

  it('does not render controls', () => {
    const help = document.querySelector('.controls');
    expect(help).not.toBeInTheDocument();
  });

  it('listens to "beforeunload" event', () => {
    expect(global.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      instance.handleWindowClose
    );
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
      jest.useFakeTimers();
      createMocks();
      props = setCurrent({});
      store.dispatch(addToQueue(props.party.current));
      const { rerender } = renderResult;
      rerender(element());
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('does not render help text for no video', () => {
      const help = document.querySelector('.noVideoHelp');
      expect(help).not.toBeInTheDocument();
    });

    it('renders controls', () => {
      expect(document.querySelector('.controls')).toBeInTheDocument();
    });

    it('renders a video player', () => {
      const player = screen.queryByTestId('Player');
      expect(player).toBeInTheDocument();
    });

    describe('toggling full screen', () => {
      beforeEach(async () => {
        const button = await screen.findByRole('button', {
          name: /full screen/i,
        });
        button.click();
      });

      it('invokes screenfull toggle', () => {
        expect(props.screenfull.toggle).toHaveBeenCalled();
      });
    });

    describe.skip('idling and activity', () => {
      it('shows controls at first', () => {
        const controls = screen.queryByRole('button', { name: /full screen/i });
        expect(controls).toBeVisible();
      });

      describe('after a period of inactivity', () => {
        beforeEach(() => {
          // TODO: This does not work. How to test this?
          jest.advanceTimersByTime(1000 * 6);
          instance.handleIdle();
          const { rerender } = renderResult;
          rerender(element());
        });

        it('hides controls', () => {
          const controls = screen.queryByRole('button', {
            name: /full screen/i,
          });
          expect(controls).not.toBeVisible();
        });

        describe('when it becomes active again', () => {
          beforeEach(() => {
            instance.handleActive();
            page.update();
          });

          it('shows controls again', () => {
            expect(page.find('.controls.invisible')).not.toExist();
          });
        });
      });
    });

    describe.skip('when standalone player is closed by controller', () => {
      let oldClose;
      beforeEach(() => {
        oldClose = global.close;
        global.close = jest.fn();
        props = {
          ...props,
          currentUser: {
            ...props.currentUser,
            standAlonePlayer: false,
          },
        };
        const { rerender } = renderResult;
        rerender(element());
      });

      afterEach(() => {
        global.close = oldClose;
      });

      it('closes the window', () => {
        expect(global.close).toHaveBeenCalled();
      });
    });
  });

  describe('when window is closed', () => {
    beforeEach(() => {
      instance.handleWindowClose();
    });

    it('sends closeStandalonePlayer signal', () => {
      expect(props.signal.send).toHaveBeenCalledWith(
        'closeStandalonePlayer',
        true
      );
    });
  });
});

// describe.skip('PartyPlayerPageWithStyles', () => {
//   let page, props;

//   const mountPage = () => shallow(<PartyPlayerPageWithStyle {...props} />);

//   beforeEach(() => {
//     props = { ...defaultProps, dispatch: jest.fn() };
//     page = mountPage();
//   });

//   it('renders without crashing', () => {
//     expect(page).toExist();
//   });
// });
