import React from 'react';
import { mount, shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';
import createRouterContext from 'react-router-test-context';

import { newParty } from 'actions/partyActions';
import { clearNewPartyCreated } from 'actions/uiActions';
import StartForm from './StartForm';
import { Start } from './Start';

describe('Start', () => {
  let component, props, redirect;

  function mountStart() {
    const context = createRouterContext();
    return shallow(<Start {...props} />, { context });
  }

  beforeEach(() => {
    props = {
      userName: 'John Woo',
      dispatch: jest.fn(),
      newPartyCreated: null,
    };
    component = mountStart();
  });

  it('sets userName of StartForm', () => {
    const form = component.find(StartForm);
    expect(form).toHaveProp('userName', props.userName);
  });

  it('does not render redirect by default', () => {
    const redirect = component.find(Redirect);
    expect(redirect).not.toExist();
  });

  describe('when handleParty is called', () => {
    let party, form;
    beforeEach(() => {
      party = { name: 'Graduation!' };
      form = component.find(StartForm);
      form.prop('onPartySet').call(null, party);
    });

    it('dispatches newParty with party values', () => {
      expect(props.dispatch).toHaveBeenCalledWith(newParty(party));
    });
  });

  describe('when newPartyCreated prop is set', () => {
    beforeEach(() => {
      props.newPartyCreated = 'the-great-party-2568';
      component = mountStart();
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

      it('dispatches to clear newPartyCreated', () => {
        expect(props.dispatch).toHaveBeenCalledWith(clearNewPartyCreated());
      });
    });
  });

  describe('when newPartyCreated props is an empty string', () => {
    beforeEach(() => {
      props.newPartyCreated = '';
      component = mountStart();
      redirect = component.find(Redirect);
    });

    it('does not render redirect', () => {
      expect(redirect).not.toExist();
    });
  });
});
