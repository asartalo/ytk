import React from 'react';
import { mount } from 'enzyme';
import Start from './Start';

describe('Start', () => {
  let component, props;
  beforeEach(() => {
    props = {
      userName: 'John Woo',
      onPartySet: jest.fn(),
    };
    component = mount(<Start {...props} />);
  });

  it('calls onPartySet with party values', () => {
    component
      .find('input#new-party-name')
      .simulate('change', { target: { value: 'Bloc Party' } });
    component.find('form').simulate('submit');
    expect(props.onPartySet).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.stringMatching('Bloc Party') })
    );
  });
});
