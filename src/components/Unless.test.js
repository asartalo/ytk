import React from 'react';
import { shallow } from 'enzyme';

import Unless from './Unless';

describe('Unless', () => {
  let component;

  const mountComponent = props =>
    shallow(
      <Unless {...props}>
        <h1>Unless True</h1>
        <h2>And True</h2>
      </Unless>
    );

  describe('if condition is falsy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: false });
    });

    it('renders children', () => {
      expect(component.find('h1')).toExist();
      expect(component.find('h2')).toExist();
    });
  });

  describe('if condition is truthy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: true });
    });

    it('does not render children', () => {
      expect(component.find('h1')).not.toExist();
      expect(component.find('h2')).not.toExist();
    });
  });
});
