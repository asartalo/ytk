import { themeToggle } from 'helpers/theme';

const borderColor = theme =>
  theme.palette.grey[themeToggle(theme, '300', '800')];

const styles = theme => ({
  root: {
    justifyContent: 'center',
  },

  sidePanel: {
    paddingTop: 56,
    backgroundColor: theme.palette.background.default,
    borderLeft: `1px solid ${borderColor(theme)}`,
    overflow: 'hidden',
    position: 'relative',

    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
      maxHeight: 'auto',
    },
  },

  sidePanelStandalone: {
    borderRight: `1px solid ${borderColor(theme)}`,
    backgroundColor: theme.palette.background.paper,
  },

  videoContainer: {
    paddingTop: 56,
    maxHeight: '100vh',
    backgroundColor: 'black',
  },
});

export default styles;
