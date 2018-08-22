import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  progressFullscreen: {
    top: 'calc(50vh - 20px)',
    left: 'calc(50vw - 20px)',
    position: 'fixed',
  },
});

export function ProgressOrChildren(props) {
  const { inProgress, children, classes } = props;
  if (inProgress) {
    return <CircularProgress className={classes.progressFullscreen} />;
  }
  return children;
}

ProgressOrChildren.propTypes = {
  inProgress: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(ProgressOrChildren);
