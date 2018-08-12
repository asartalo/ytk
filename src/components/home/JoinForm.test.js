import React from 'react';
import { mount } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';

import JoinForm from './JoinForm';

describe('JoinForm', () => {
  let form, props;

  const mountForm = () => mount(<JoinForm {...props} />);

  beforeEach(() => {
    props = {
      userName: 'Paula',
      inProgress: false,
      error: null,
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
});
