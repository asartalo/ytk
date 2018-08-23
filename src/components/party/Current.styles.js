const styles = theme => ({
  card: {
    display: 'flex',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  details: {
    display: 'flex',
    flexBasis: '100%',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  playerControls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  miscControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

export default styles;
