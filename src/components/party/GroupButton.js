import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';

const styles = theme => ({
  icon: {
    color: '#fff',
  },
});

function GroupButton({ onClick, classes }) {
  return (
    <IconButton onClick={onClick}>
      <GroupIcon className={classes.icon} />
    </IconButton>
  );
}

GroupButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GroupButton);
