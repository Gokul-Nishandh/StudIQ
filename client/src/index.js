import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import AppContextProvider from './contexts/AppContexts';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
</BrowserRouter>
);


