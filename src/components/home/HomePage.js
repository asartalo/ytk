import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import microphoneBg from 'images/microphone02.jpg';

const styles = theme => {
  const homeTransition = `${theme.transitions.duration}ms ${
    theme.transitions.easing.easeInOut
  }`;
  return {
    home: {
      minHeight: '100vh',
      textAlign: 'center',
      transition: homeTransition,
    },

    revealer: {
      minHeight: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      transitionDuration: '500ms',
      transitionDelay: '400ms',
    },

    paperRoot: {
      fontWeight: 300,
      padding: '10px 20px 80px',
      transitionDuration: '200ms',
    },

    body: {
      display: 'relative',
      transition: homeTransition,
    },

    mainTitle: {
      ...theme.typography.display4,
      fontWeight: 100,
      color: theme.palette.primary.main,
      margin: '75px 0 0 0',
      // transition: easings.rubber,
      transition: homeTransition,
      transitionDuration: '300ms',
    },

    subHeading: {
      ...theme.typography.display1,
      marginBottom: '68px',
      transition: '500ms',
    },

    start: {
      '& $revealer': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
    },

    loading: {
      '& $revealer': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
    },

    inputStarted: {
      '& $mainTitle': {
        transform: 'scale3d(0.6, 0.6, 1)',
        color: theme.palette.primary.main,
        margin: '10px 0 0',
      },

      '& $subHeading': {
        transform: 'scale3d(1, 0, 1)',
        opacity: 0,
        height: 0,
        margin: '0 0 20px',
      },
    },

    [theme.breakpoints.up('xs')]: {
      home: {
        backgroundImage: 'none',
      },

      revealer: {
        padding: 0,
      },

      paperRoot: {
        margin: 0,
        borderRadius: 0,
        minHeight: '100vh',
      },
    },

    [theme.breakpoints.up('sm')]: {
      home: {
        backgroundImage: `url('${microphoneBg}')`,
        backgroundSize: 'cover',
      },

      revealer: {
        padding: theme.spacing.unit,
      },

      paperRoot: {
        margin: '40px auto 0',
        maxWidth: '320px',
        minHeight: 'auto',
      },
    },
  };
};

function loadingOrChildren(isLoading, children) {
  return isLoading ? <CircularProgress /> : children;
}

function HomePage(props) {
  const { classes, children, homeState } = props;
  const homeClass = `${classes.home} ${classes[homeState]}`;
  const isLoading = homeState === 'start' || homeState === 'loading';
  const elevation = isLoading ? 0 : 3;
  return (
    <div className={homeClass}>
      <div className={classes.revealer}>
        <Paper elevation={elevation} className={classes.paperRoot}>
          <h1 className={classes.mainTitle}>Okee!</h1>
          <p className={classes.subHeading}>
            YouTube-Powered<br />Karaoke Party
          </p>
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
};

export default withStyles(styles)(HomePage);
