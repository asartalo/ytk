import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { shallowWithRouter } from '../../helpers/enzymeTest';
import MuiSizeWrapper from '../../helpers/MuiSizeWrapper';

import userReducer from '../../reducers/currentUser';
import partyReducer from '../../reducers/party';
import staticVideoData from '../../fixtures/staticVideoData';
import { currentUserActions } from '../../actions';
import ConnectedPlayer from './ConnectedPlayer';

import PartyPageWithStyle, { PartyPage } from './PartyPage';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import mockStore from '../../helpers/mockStore';
import { addToQueue } from '../../actions/partyActions';

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
  let page,
    props,
    store,
    instance,
    renderResult,
    showPartyPage = true;

  const elements = () => (
    <MuiSizeWrapper>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          {showPartyPage ? <PartyPage {...props} /> : null}
        </MemoryRouter>
      </Provider>
    </MuiSizeWrapper>
  );

  beforeEach(() => {
    store = mockStore();
    props = {
      ...defaultPropsNaked,
      dispatch: jest.fn(),
      ref: node => {
        instance = node;
      },
      signal: {
        listen: jest.fn(),
        clear: jest.fn(),
      },
    };
  });

  const renderPage = () => {
    renderResult = render(elements());
    return renderResult;
  };

  describe('when component has mounted', () => {
    beforeEach(() => {
      showPartyPage = true;
      renderPage();
    });

    it('listens to closeStandalonePlayer signal', () => {
      expect(props.signal.listen).toHaveBeenCalledWith(
        'closeStandalonePlayer',
        instance.handleStandalonePlayerClose
      );
    });

    it('show add button when there is no current and queue is empty', () => {
      const fabButton = screen.getByTestId('FabAddButton');
      expect(fabButton).toBeInTheDocument();
    });

    it('does not show a player as there is no current video', () => {
      const player = screen.queryByTestId('Player');
      expect(player).not.toBeInTheDocument();
    });

    it('renders help text for empty queue', () => {
      const help = screen.getByTestId('Empty Queue Help');
      expect(help).toBeInTheDocument();
    });

    describe('when component unmounts', () => {
      let handler;

      beforeEach(() => {
        handler = instance.handleStandalonePlayerClose;
        showPartyPage = false;
        const { rerender } = renderResult;
        rerender(elements());
      });

      it('clears closeStandalonePlayer signal listener', () => {
        expect(props.signal.clear).toHaveBeenCalledWith(
          'closeStandalonePlayer',
          handler
        );
      });
    });
  });

  describe.skip('when there is current item on party', () => {
    const setCurrent = current => {
      const currentItem = {
        ...sampleVideo,
        addedBy: 'JID',
        queueId: 'FOO-bar-18388',
        isPlaying: false,
        at: 0.0,
        ...current,
      };
      return {
        ...props,
        party: {
          ...props.party,
          current: currentItem,
        },
      };
    };

    beforeEach(() => {
      props = setCurrent({});
      store.dispatch(addToQueue(props.party.current));
      cleanup();
      renderPage();
    });

    it('shows the add menu', () => {
      const fabButton = screen.getByTestId('FabAddButton');
      expect(fabButton).toBeInTheDocument();
    });

    it('does not render help text for empty queue', () => {
      const help = screen.queryByTestId('Empty Queue Help');
      expect(help).not.toBeInTheDocument();
    });

    describe.skip('rendered ConnectedPlayer', () => {
      let player;
      beforeEach(() => {
        player = page.find(ConnectedPlayer);
      });

      it('renders a video player', () => {
        expect(player).toExist();
      });
    });
  });

  describe.skip('when handleStandalonePlayerClose is called', () => {
    beforeEach(() => {
      page.instance().handleStandalonePlayerClose();
    });

    it('dispatches standAlonePlayerOff action', () => {
      expect(props.dispatch).toHaveBeenCalledWith(
        currentUserActions.standAlonePlayerOff()
      );
    });
  });
});

describe.skip('PartyPageWithStyles', () => {
  let page, props;

  const mountPage = () => shallowWithRouter(<PartyPageWithStyle {...props} />);

  beforeEach(() => {
    props = {
      ...defaultProps,
      dispatch: jest.fn(),
      signal: {
        listen: jest.fn(),
      },
    };
    page = mountPage();
  });

  it('renders without crashing', () => {
    expect(page).toExist();
  });
});
