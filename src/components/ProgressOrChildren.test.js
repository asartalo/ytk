import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { shallow } from 'enzyme';

import ProgressOrChildren from './ProgressOrChildren';

describe('ProgressOrChildren', () => {
  let component, props, child;

  const renderComponent = () => {
    return shallow(
      <ProgressOrChildren {...props}>
        <div id="the-child" />
      </ProgressOrChildren>
    );
  };

  beforeEach(() => {
    props = {
      inProgress: false,
    };
    component = renderComponent();
  });

  it('shows children when inProgress is false', () => {
    expect(component.find('#the-child')).toExist();
  });

  it('does not show progress indicator', () => {
    expect(component.find(CircularProgress)).not.toExist();
  });

  describe('when in progress', () => {
    beforeEach(() => {
      props = {
        inProgress: true,
      };
      component = renderComponent();
    });

    it('does not shows children', () => {
      expect(component.find('#the-child')).not.toExist();
    });

    it('shows progress indicator', () => {
      expect(component.find(CircularProgress)).toExist();
    });
  });
});
