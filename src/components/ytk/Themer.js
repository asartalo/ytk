import React, { Component } from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    // type: 'dark',
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#fd4544',
      // dark: '#9a0007',
      contrastText: '#fff',
    },

    secondary: {
      main: '#8bc34a',
      light: '#a2cf6e',
      dark: '#618833',
      contrastText: '#fff',
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
