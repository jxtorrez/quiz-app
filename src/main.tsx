import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

// Detectar si estamos en producción
const isProd = import.meta.env.MODE === 'production'
// Detecta si fue redirigido desde 404.html (cuando GitHub Pages no encontró la ruta)
const urlParams = new URLSearchParams(window.location.search);
const redirectedPath = urlParams.get("p");
if (redirectedPath) {
  window.history.replaceState(null, "", redirectedPath);
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={isProd ? '/quiz-app' : '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
