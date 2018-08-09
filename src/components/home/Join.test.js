import React from 'react';
import { mount } from 'enzyme';
import { Redirect } from 'react-router-dom';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

import { joinParty } from 'actions/partyActions';
import { clearNewPartyJoined } from 'actions/uiActions';
import JoinForm from './JoinForm';
import { Join } from './Join';

describe('Join', () => {
  let component, props, redirect;

  function mountJoin() {
    const options = new ReactRouterEnzymeContext();
    return mount(<Join {...props} />, options.get());
  }

  beforeEach(() => {
    props = {
      userName: 'Jane Smith',
      dispatch: jest.fn(),
      newPartyJoined: null,
    };
    component = mountJoin();
  });

  it('renders a JoinForm', () => {
    const form = component.find(JoinForm);
    expect(form).toExist();
  });

  it('sets userName of JoinForm', () => {
    const form = component.find(JoinForm);
    expect(form).toHaveProp('userName', props.userName);
  });

  it('does not render redirect by default', () => {
    const redirect = component.find(Redirect);
    expect(redirect).not.toExist();
  });

  describe('when handleParty is called', () => {
    let partyId, form;
    beforeEach(() => {
      partyId = 'graduation-1888';
      form = component.find(JoinForm);
      form.prop('onPartySet').call(null, partyId);
    });

    it('dispatches newParty with party values', () => {
      expect(props.dispatch).toHaveBeenCalledWith(joinParty(partyId));
    });
  });

  describe('when newPartyJoined prop is set', () => {
    beforeEach(() => {
      props.newPartyJoined = 'the-great-party-2568';
      component = mountJoin();
      redirect = component.find(Redirect);
    });

    it('renders redirect', () => {
      expect(redirect).toExist();
    });

    it('redirects to party page', () => {
      expect(redirect).toHaveProp('to', '/the-great-party-2568');
    });

    describe('when it unmounts', () => {
      beforeEach(() => {
        component.instance().componentWillUnmount();
      });

      it('dispatches to clear newPartyJoined', () => {
        expect(props.dispatch).toHaveBeenCalledWith(clearNewPartyJoined());
      });
    });
  });

  describe('when newPartyJoined props is an empty string', () => {
    beforeEach(() => {
      props.newPartyJoined = '';
      component = mountJoin();
      redirect = component.find(Redirect);
    });

    it('does not render redirect', () => {
      expect(redirect).not.toExist();
    });
  });
});
