import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

// Detectar si estamos en producción
const isProd = import.meta.env.MODE === 'production'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={isProd ? '/quiz-app' : '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
