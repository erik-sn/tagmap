import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

import App from './app';

const rootEl = document.getElementById('app-container');

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );
};

render(App);

// react hot module reloading
if (module.hot) {
  module.hot.accept('./app', () => {
    render(App);
  });
}
