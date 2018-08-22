const styles = theme => ({
  root: {},

  mainContent: {
    width: '100%',
  },

  mainPlayer: {
    width: '100%',
    height: 'calc(100vh - 56px)',

    [theme.breakpoints.down('sm')]: {
      height: 0,
      paddingTop: '56.25%',
    },
  },

  emptyQueueHelp: {
    ...theme.typography.headline,
    textAlign: 'center',
    paddingTop: 56,
  },

  emptyQueueHeadline: {
    ...theme.typography.display3,
  },
});

export default styles;
