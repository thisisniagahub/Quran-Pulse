import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming a global CSS file exists
import { AudioProvider } from './context/AudioContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
