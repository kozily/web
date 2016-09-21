import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Application from './ui/application';

ReactDOM.render(
  <AppContainer>
    <Application />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./ui/application', () => {
    const NextApp = require('./ui/application').default;

    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
