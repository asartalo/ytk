import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Party from './Party';
import Body from '../components/ytk/Body';
import AppRedirect from '../components/AppRedirect';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Body>
          <Router>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/:party/*" element={<Party />} />
            </Routes>
            <AppRedirect />
          </Router>
        </Body>
      </div>
    );
  }
}

export default App;
