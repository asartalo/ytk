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
      inProgress: false,
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
});
