import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from './SocketProvider';

import App from './App';
import './index.css';

// const ENDPOINT = '192.168.1.22:8085';
const ENDPOINT = 'localhost:8085';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider ENDPOINT={ENDPOINT}>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
