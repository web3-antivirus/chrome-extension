import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/scss/global.scss';
import TracingPage from './containers/TracingPage';
import ModalsProvider from './context/modals.context';
import Modals from './modules/modals';

ReactDOM.render(
  <React.StrictMode>
    <ModalsProvider>
      <Modals />
      <TracingPage />
    </ModalsProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
