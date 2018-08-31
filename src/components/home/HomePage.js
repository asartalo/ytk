import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './HomePage.styles';

function loadingOrChildren(isLoading, children) {
  return isLoading ? <CircularProgress /> : children;
}

const defaultText = (
  <React.Fragment>
    YouTube-Powered<br />Karaoke Party
  </React.Fragment>
);

function HomePage(props) {
  const { classes, children, homeState, subtext } = props;
  const homeClass = `${classes.home} ${classes[homeState]}`;
  const isLoading = homeState === 'start' || homeState === 'loading';
  const elevation = isLoading ? 0 : 3;
  return (
    <div className={homeClass}>
      <div className={classes.revealer}>
        <Paper elevation={elevation} className={classes.paperRoot}>
          <h1 className={classes.mainTitle}>Okee!</h1>
          <p className={classes.subHeading}>{subtext || defaultText}</p>
          <div className={classes.body}>
            {loadingOrChildren(isLoading, children)}
          </div>
        </Paper>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  homeState: PropTypes.string.isRequired,
  subtext: PropTypes.string,
};

export default withStyles(styles)(HomePage);
