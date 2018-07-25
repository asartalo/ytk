import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';

import Home from './Home';
import DataSync from 'components/ytk/DataSync';
import Body from 'components/ytk/Body';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <ScrollContext>
            <Body>
              <Switch>
                <Route exact path="/" component={Home} />
              </Switch>
            </Body>
          </ScrollContext>
        </Router>
        <DataSync />
      </div>
    );
  }
}

export default App;
