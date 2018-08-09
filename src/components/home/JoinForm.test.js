import React from 'react';
import { mount } from 'enzyme';

import JoinForm from './JoinForm';

describe('JoinForm', () => {
  let form, props;

  beforeEach(() => {
    props = {
      userName: 'Paula',
    };
    form = mount(<JoinForm {...props} />);
  });

  it('renders form without any problem', () => {
    expect(form.find('form')).toExist();
  });
});
