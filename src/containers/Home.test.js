import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './Home';

describe('Home', () => {
  let home, props;

  const mount = () => {
    return shallow(<Home {...props} />);
  }

  beforeEach(() => {
    props = {
      currentUser: { name: '' }
    };
  });

  it('renders without crashing', () => {
    mount();
  });
});

