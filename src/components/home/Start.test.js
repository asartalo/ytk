import React from 'react';
import { mount } from 'enzyme';

import { newParty } from 'actions/partyActions';
import StartForm from './StartForm';
import { Start } from './Start';

describe('Start', () => {
  let component, props;
  beforeEach(() => {
    props = {
      userName: 'John Woo',
      dispatch: jest.fn(),
    };
    component = mount(<Start {...props} />);
  });

  it('sets userName of StartForm', () => {
    const form = component.find(StartForm);
    expect(form).toHaveProp('userName', props.userName);
  });

  it('dispatches newParty with party values when handleParty is called', () => {
    const party = { name: 'Graduation!' };
    const form = component.find(StartForm);
    form.prop('onPartySet').call(null, party);
    expect(props.dispatch).toHaveBeenCalledWith(newParty(party));
  });
});
