import React from 'react';
import { Redirect } from 'react-router-dom';

import { mountWithRouter } from 'helpers/enzymeTest';

import { newParty } from 'actions/partyActions';
import StartForm from './StartForm';
import { Start } from './Start';

describe('Start', () => {
  let component, props, redirect;

  function mountStart() {
    return mountWithRouter(<Start {...props} />);
  }

  beforeEach(() => {
    props = {
      userName: 'John Woo',
      dispatch: jest.fn(),
    };
    component = mountStart();
  });

  it('sets userName of StartForm', () => {
    const form = component.find(StartForm);
    expect(form).toHaveProp('userName', props.userName);
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
});
