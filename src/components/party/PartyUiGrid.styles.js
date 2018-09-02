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
      borderTop: `1px solid ${borderColor(theme)}`,
    },

    [theme.breakpoints.down('xs')]: {
      paddingTop: 56,
    },
  },

  sidePanelStandalone: {
    borderRight: `1px solid ${borderColor(theme)}`,
    borderTop: `1px solid ${borderColor(theme)}`,
    backgroundColor: theme.palette.background.paper,
    marginTop: 80,
    minHeight: 'calc(100vh - 80px)',
    paddingTop: 0,
  },

  mainSection: {
    paddingTop: 56,
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
});

export default styles;
