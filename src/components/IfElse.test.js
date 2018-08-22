import React from 'react';
import { shallow } from 'enzyme';

import IfElse from './IfElse';

describe('IfElse', () => {
  let component;

  const mountComponent = props =>
    shallow(
      <IfElse {...props}>
        <h1>If True</h1>
        <h2>If False</h2>
        <h3>Never found</h3>
      </IfElse>
    );

  describe('if condition is truthy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: true });
    });

    it('renders first child', () => {
      expect(component.find('h1')).toExist();
    });

    it('does not render second child', () => {
      expect(component.find('h2')).not.toExist();
    });

    it('does not render any other child', () => {
      expect(component.find('h3')).not.toExist();
    });
  });

  describe('if condition is falsy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: false });
    });

    it('does not render the first child', () => {
      expect(component.find('h1')).not.toExist();
    });

    it('renders the second child', () => {
      expect(component.find('h2')).toExist();
    });

    it('does not render any other child', () => {
      expect(component.find('h3')).not.toExist();
    });
  });
});
