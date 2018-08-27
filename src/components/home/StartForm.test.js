import React from 'react';
import { mount } from 'enzyme';
import StartFormWithStyles, { StartForm } from './StartForm';

describe('StartForm', () => {
  let component, props;
  beforeEach(() => {
    props = {
      userName: 'John Woo',
      onPartySet: jest.fn(),
      classes: {},
    };
    component = mount(<StartForm {...props} />);
  });

  it('renders text input', () => {
    const input = component.find('input#new-party-name');
    expect(input).toExist();
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

  it('focuses on the text field on mount', () => {
    const mounted = component.instance();
    const inputRef = mounted.inputRef;
    inputRef.current.focus = jest.fn();
    mounted.componentDidMount();
    expect(inputRef.current.focus).toHaveBeenCalled();
  });
});

describe('StartFormWithStyles', () => {
  it('renders without crashing', () => {
    const props = {
      userName: 'John Woo',
      onPartySet: jest.fn(),
    };
    expect(mount(<StartFormWithStyles {...props} />)).toExist();
  });
});
