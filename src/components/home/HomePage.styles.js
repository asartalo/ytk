import microphoneBg from '../../images/microphone02.jpg';

const styles = ({ transitions, typography, palette, breakpoints, spacing }) => {
  const { duration, easing } = transitions;
  const homeTransition = `${duration.short}ms ${easing.easeInOut}`;
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
      transitionDuration: duration.short,
    },

    body: {
      display: 'relative',
      transition: homeTransition,
    },

    mainTitle: {
      ...typography.h4,
      fontSize: '6rem',
      fontWeight: 100,
      color: palette.primary.main,
      margin: '70px 0 0 0',
      transition: homeTransition,
      transitionDuration: duration.standard,
    },

    subHeading: {
      ...typography.h4,
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
        color: palette.primary.main,
      },

      '& $subHeading': {
        transform: 'scale3d(1, 0, 1)',
        opacity: 0,
        height: 0,
        margin: '0 0 20px',
      },
    },

    [breakpoints.up('xs')]: {
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

    [breakpoints.up('sm')]: {
      home: {
        backgroundImage: `url('${microphoneBg}')`,
        backgroundSize: 'cover',
      },

      revealer: {
        padding: spacing(1),
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
