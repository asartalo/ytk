import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = theme => ({
  button: {
    padding: '10px 32px 8px 16px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

function HomeButton(props) {
  const { children, classes } = props;
  const filteredProps = { ...props };
  delete filteredProps.classes;
  return (
    <Button
      color="primary"
      type="submit"
      {...filteredProps}
      className={classes.button}
      variant="contained"
    >
      <MusicNoteIcon className={classes.extendedIcon} />
      {children}
    </Button>
  );
}

HomeButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeButton);
