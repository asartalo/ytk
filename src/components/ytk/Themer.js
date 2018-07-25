import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff0080',
      light: '#ff5daf',
      dark: '#c50054',
      contrastText: '#000',
    },
  },
  typography: {
    fontWeightLight: 100,
    fontWeightMedium: 400,
    fontWeightRegular: 300,
  },
});

class Themer extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    );
  }
}

export default Themer;
