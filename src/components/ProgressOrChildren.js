import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ProgressOrChildren(props) {
  const { inProgress, children } = props;
  if (inProgress) {
    return <CircularProgress />;
  }
  return children;
}

ProgressOrChildren.propTypes = {
  inProgress: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
