import React from 'react';
import { mount } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';

import JoinFormWithStyle, { JoinForm } from './JoinForm';

describe('JoinForm', () => {
  let form, props;

  const mountForm = () => mount(<JoinForm {...props} />);

  beforeEach(() => {
    props = {
      userName: 'Paula',
      inProgress: false,
      onPartySet: jest.fn(),
      error: null,
      classes: {},
    };
  });

  it('renders form without any problem', () => {
    form = mountForm();
    expect(form.find('form')).toExist();
  });

  it('does not show loading indicator by default', () => {
    form = mountForm();
    expect(form.find(CircularProgress)).not.toExist();
  });

  describe('when in progress', () => {
    beforeEach(() => {
      props.inProgress = true;
      form = mountForm();
    });

    it('shows a loading indicator when joining is in progress', () => {
      expect(form.find(CircularProgress)).toExist();
    });
  });

  it('shows error message when there is an error', () => {
    props.error = 'There was a problem';
    form = mountForm();
    expect(form.find('form')).toIncludeText(props.error);
  });

  it('focuses on the text field on mount', () => {
    const mounted = mountForm().instance();
    const inputRef = mounted.inputRef;
    inputRef.current.focus = jest.fn();
    mounted.componentDidMount();
    expect(inputRef.current.focus).toHaveBeenCalled();
  });

  it('calls onPartySet when form is submitted', () => {
    const form = mountForm();
    form
      .find('input#join-party-id')
      .simulate('change', { target: { value: ' the-party-id-123 ' } });
    form.find('form').simulate('submit');
    expect(props.onPartySet).toHaveBeenCalledWith('the-party-id-123');
  });

  it('calls onParty set with proper party id when passed with a link', () => {
    const form = mountForm();
    form
      .find('input#join-party-id')
      .simulate('change', {
        target: { value: 'http://my-domain.com/a-party-8888 ' },
      });
    form.find('form').simulate('submit');
    expect(props.onPartySet).toHaveBeenCalledWith('a-party-8888');
  });
});

describe('JoinFormWithStyle', () => {
  it('renders without crashing', () => {
    const props = {
      userName: 'John Woo',
      inProgress: false,
      onPartySet: jest.fn(),
    };
    expect(mount(<JoinFormWithStyle {...props} />)).toExist();
  });
});
