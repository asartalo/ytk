import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearRedirect } from '../actions/uiActions';

function AppRedirect({ to, dispatch }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (to) {
      dispatch(clearRedirect());
    }
  }, [to, dispatch]);
  if (to) {
    navigate(to);
  }

  return <>{null}</>;
}

export default connect(({ ui }) => {
  return {
    to: ui.redirectTo,
  };
})(AppRedirect);
