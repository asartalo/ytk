import React, { Component } from 'react';
import YTKAppBar from 'components/YTKAppBar';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <YTKAppBar />
        <h1>YouTube Karaoke</h1>
      </div>
    );
  }
}

export default App;
