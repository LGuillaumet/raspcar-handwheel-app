import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from './SocketProvider';

import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider ENDPOINT="192.168.1.22:8085">
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
