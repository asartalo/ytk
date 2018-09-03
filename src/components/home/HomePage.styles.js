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
      fontSize: '6rem',
      fontWeight: 100,
      color: theme.palette.primary.main,
      margin: '70px 0 0 0',
      transition: homeTransition,
      transitionDuration: '300ms',
    },

    subHeading: {
      ...theme.typography.display1,
      marginBottom: 68,
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
        color: theme.palette.primary.main,
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

export default styles;
