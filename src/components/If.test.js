import React from 'react';
import { mount } from 'enzyme';

import If from './If';

describe('If', () => {
  let component;

  const mountComponent = props =>
    mount(
      <If {...props}>
        <h1>If True</h1>
        <h2>And True</h2>
      </If>
    );

  describe('if condition is truthy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: true });
    });

    it('renders children', () => {
      expect(component.find('h1')).toExist();
      expect(component.find('h2')).toExist();
    });
  });

  describe('if condition is falsy', () => {
    beforeEach(() => {
      component = mountComponent({ condition: false });
    });

    it('renders children', () => {
      expect(component.find('h1')).not.toExist();
      expect(component.find('h2')).not.toExist();
    });
  });
});
