import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/plus-jakarta-sans';
import './styles.css';
import App from './App.jsx';

const akar = document.getElementById('root');
if (!akar) throw new Error('Elemen #root tidak ada di index.html');

createRoot(akar).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
