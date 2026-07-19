import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import StartupSplash from './components/StartupSplash.tsx';
import './index.css';

const savedDarkMode = localStorage.getItem('darkMode');
const useDarkMode = savedDarkMode !== null
  ? savedDarkMode === 'true'
  : window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', useDarkMode);
document.documentElement.style.backgroundColor = useDarkMode ? '#111318' : '#fef7ff';
document.body.style.backgroundColor = useDarkMode ? '#111318' : '#fef7ff';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <StartupSplash />
  </StrictMode>,
);
