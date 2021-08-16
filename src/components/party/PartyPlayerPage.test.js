import React from 'react';

import { mount, shallow } from 'enzyme';

import { Provider } from 'react-redux';
import mockStore from '../../helpers/mockStore';
import userReducer from '../../reducers/currentUser';
import partyReducer from '../../reducers/party';
import staticVideoData from '../../fixtures/staticVideoData';
import ConnectedPlayer from './ConnectedPlayer';

import PartyPlayerPageWithStyle, { PartyPlayerPage } from './PartyPlayerPage';

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
  let page, props, store, oldAddEventListener;

  const mountPage = () =>
    mount(
      <Provider store={store}>
        <PartyPlayerPage {...props} />
      </Provider>
    );

  beforeEach(() => {
    store = mockStore();
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
    };
    page = mountPage();
  });

  afterEach(() => {
    global.addEventListener = oldAddEventListener;
  });

  it('does not show a player as there is no current video', () => {
    const player = page.find(ConnectedPlayer);
    expect(player).not.toExist();
  });

  it('renders help text for no video', () => {
    const help = page.find('.noVideoHelp');
    expect(help).toExist();
  });

  it('does not render controls', () => {
    expect(mountPage().find('.controls')).not.toExist();
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
    let instance;

    beforeEach(() => {
      props = setCurrent({});
      store = mockStore({ party: props.party });
      page = mountPage();
      instance = page.find(PartyPlayerPage).instance();
    });

    it('does not render help text for no video', () => {
      const help = page.find('.noVideoHelp');
      expect(help).not.toExist();
    });

    it('renders controls', () => {
      expect(page.find('.controls')).toExist();
    });

    it('passes fullscreen handler', () => {
      expect(page.find('.mainButton').first()).toHaveProp(
        'onClick',
        instance.handleFullScreenToggle
      );
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

    describe('toggling full screen', () => {
      beforeEach(() => {
        page
          .find('.mainButton')
          .first()
          .simulate('click');
      });

      it('invokes screenfull toggle', () => {
        expect(props.screenfull.toggle).toHaveBeenCalled();
      });
    });

    describe('idling and activity', () => {
      it('shows controls at first', () => {
        expect(page.find('.controls.invisible')).not.toExist();
      });

      describe('after a period of inactivity', () => {
        beforeEach(() => {
          instance.handleIdle();
          page.update();
        });

        it('hides controls at first', () => {
          expect(page.find('.controls.invisible')).toExist();
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

    describe('when standalone player is closed by controller', () => {
      let oldClose, oldProps;
      beforeEach(() => {
        oldClose = global.close;
        global.close = jest.fn();
        oldProps = props;
        props = {
          ...props,
          currentUser: {
            ...props.currentUser,
            standAlonePlayer: false,
          },
        };
        page = mountPage();
        page
          .find(PartyPlayerPage)
          .instance()
          .componentDidUpdate(oldProps);
      });

      afterEach(() => {
        global.close = oldClose;
      });

      it('closes the window', () => {
        expect(global.close).toHaveBeenCalled();
      });
    });
  });

  it('listens to "beforeunload" event', () => {
    const instance = page.find(PartyPlayerPage).instance();
    expect(global.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      instance.handleWindowClose
    );
  });

  describe('when window is closed', () => {
    beforeEach(() => {
      const instance = page.find(PartyPlayerPage).instance();
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

describe('PartyPlayerPageWithStyles', () => {
  let page, props;

  const mountPage = () => shallow(<PartyPlayerPageWithStyle {...props} />);

  beforeEach(() => {
    props = { ...defaultProps, dispatch: jest.fn() };
    page = mountPage();
  });

  it('renders without crashing', () => {
    expect(page).toExist();
  });
});
