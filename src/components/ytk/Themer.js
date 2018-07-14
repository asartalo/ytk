import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#fff',

    },
    // primary: {
    //   main: '#ff7030',
    //   // main: '#e8006f',
    //   light: '#ffa15e',
    //   dark: '#c53f00',
    //   // contrastText: '#000',
    //   contrastText: '#fff',
    // },
    secondary: {
      main: '#ff0080',
      light: '#ff5daf',
      dark: '#c50054',
      contrastText: '#000',
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.

  },
});

class Themer extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
	{ this.props.children }
      </MuiThemeProvider>
    );
  }
}

console.log(theme);

export default Themer;

