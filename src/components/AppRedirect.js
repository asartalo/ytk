import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { clearRedirect } from 'actions/uiActions';

export class AppRedirect extends PureComponent {
  componentDidUpdate() {
    const { to, dispatch } = this.props;
    if (to) {
      dispatch(clearRedirect());
    }
  }

  render() {
    const { to } = this.props;
    return to ? <Redirect to={to} /> : null;
  }
}

export default connect(({ ui }) => {
  return {
    to: ui.redirectTo,
  };
})(AppRedirect);
