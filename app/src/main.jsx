import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from './SocketProvider';

import App from './App';
import './index.css';
// Put raspberry pi ip address here and the port of the python server
// For localhost
const ENDPOINT = '127.0.0.1:8085';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider ENDPOINT={ENDPOINT}>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
