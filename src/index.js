import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './stores/configureStore';
import App from 'containers/App';
import registerServiceWorker from './registerServiceWorker';
// TODO: check if we can move this to JSCSS
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
