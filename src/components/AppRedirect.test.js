import React from 'react';
// import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { clearRedirect } from '../actions/uiActions';
import { AppRedirect } from './AppRedirect';

let navigateCalls = [];
const mockNavigate = path => {
  navigateCalls.push(path);
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AppRedirect', () => {
  let props;
  beforeEach(() => {
    navigateCalls = [];
  });

  describe('default behavior', () => {
    beforeEach(() => {
      props = {
        dispatch: jest.fn(),
        to: null,
      };
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <AppRedirect {...props} />
        </MemoryRouter>
      );
    });

    it('does not redirect', () => {
      expect(navigateCalls.length).toEqual(0);
    });

    it('does not dispatch anything when unmounted', () => {
      expect(props.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when a redirect path is set', () => {
    beforeEach(() => {
      props = {
        dispatch: jest.fn(),
        to: '/some-path',
      };

      return render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <AppRedirect {...props} />
        </MemoryRouter>
      );
    });

    it('should redirect', () => {
      expect(navigateCalls.pop()).toEqual('/some-path');
    });

    it('dispatch a clearRedirect right after rendering', () => {
      expect(props.dispatch).toHaveBeenCalledWith(clearRedirect());
    });
  });
});
