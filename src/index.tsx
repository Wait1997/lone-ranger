import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'normalize.css';
import '@/utils/interview/improve';

// console.log('NODE_ENV', process.env.NODE_ENV);
// console.log('BASE_ENV', process.env.BASE_ENV);
// console.log('process.env', process.env);

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
