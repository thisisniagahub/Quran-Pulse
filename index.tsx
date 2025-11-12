import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming a global CSS file exists
import { AudioProvider } from './context/AudioContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DoaTrackerProvider } from './context/DoaTrackerContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AudioProvider>
        <DoaTrackerProvider>
          <App />
        </DoaTrackerProvider>
      </AudioProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
