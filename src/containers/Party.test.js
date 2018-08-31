import React from 'react';
import { mount } from 'enzyme';

import { partyActions } from 'actions';

import { Party } from './Party';

describe('Party', () => {
  let party, props;

  const mountParty = () => {
    return mount(<Party {...props} />);
  };

  beforeEach(() => {
    props = {
      currentUser: {
        name: 'Carol',
        intent: '',
        homeState: '',
      },
      party: {
        name: '',
        queue: [],
        users: [{ name: 'Carol', uid: 'MYUID' }],
        id: '',
      },
      dispatch: jest.fn(),
      match: {
        params: {
          party: 'the-party-id-8844',
        },
      },
      partyGetInProgress: true,
      partyJoinInProgress: false,
    };
  });

  it('renders without crashing', () => {
    mountParty();
  });

  it('dispatches getParty action', () => {
    mountParty();
    expect(props.dispatch).toHaveBeenCalledWith(
      partyActions.getParty('the-party-id-8844')
    );
  });

  describe('when user just joined party', () => {
    let newDispatch;
    beforeEach(() => {
      props = { ...props, partyJoinInProgress: true };
      const page = mountParty();
      newDispatch = jest.fn();
      page.setProps({ partyJoinInProgress: false, dispatch: newDispatch });
    });

    it('sends a request to get party', () => {
      expect(newDispatch).toHaveBeenCalledWith(
        partyActions.getParty('the-party-id-8844')
      );
    });
  });

  describe('when party unmounts', () => {
    beforeEach(() => {
      mountParty()
        .instance()
        .componentWillUnmount();
    });

    it('dispatches unloadParty action', () => {
      expect(props.dispatch).toHaveBeenCalledWith(
        partyActions.unloadParty('the-party-id-8844')
      );
    });
  });
});
