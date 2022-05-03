import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';

const SizeWrapper = ({ children, width = 'lg' }) => {
  const theme = createTheme({
    props: { MuiWithWidth: { initialWidth: width } },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default SizeWrapper;
