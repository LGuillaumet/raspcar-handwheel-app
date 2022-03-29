import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from './SocketProvider';

import App from './App';
import './index.css';

// const ENDPOINT = '172.20.10.2:8085';
const ENDPOINT = '127.0.0.1:8085';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider ENDPOINT={ENDPOINT}>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
