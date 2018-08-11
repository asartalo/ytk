import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';

import { clearRedirect } from 'actions/uiActions';
import { AppRedirect } from './AppRedirect';

describe('AppRedirect', () => {
  let component, props;
  describe('default behavior', () => {
    beforeEach(() => {
      props = {
        dispatch: jest.fn(),
        to: null,
      };
      component = shallow(<AppRedirect {...props} />);
    });

    it('does not render a redirect', () => {
      expect(component.find(Redirect)).not.toExist();
    });

    it('does not dispatch anything when unmounted', () => {
      component.instance().componentDidUpdate();
      expect(props.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when a redirect path is set', () => {
    beforeEach(() => {
      props = {
        dispatch: jest.fn(),
        to: '/some-path',
      };
      component = shallow(<AppRedirect {...props} />);
    });

    it('renders a redirect', () => {
      expect(component.find(Redirect)).toExist();
    });

    it('sets the redirect path to the to prop', () => {
      expect(component.find(Redirect)).toHaveProp('to', props.to);
    });

    it('dispatch a clearRedirect right after rendering', () => {
      component.instance().componentDidUpdate();
      expect(props.dispatch).toHaveBeenCalledWith(clearRedirect());
    });
  });
});
