import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import grey from '@mui/material/colors/grey';
import { MapProvider } from './context/Maps';
import { ConstantsProvider } from './context/Constants';
import { mockFetcher } from './services/mockService';

import * as serviceWorker from './serviceWorker';
import './index.css';

const App = lazy(() => import('./App'));
const rootElement = document.getElementById('root');

// Use mock fetcher in development, real fetcher in production
const fetcher =
  process.env.NODE_ENV === 'development'
    ? mockFetcher
    : (...args) =>
        fetch(...args)
          .then((response) => response.json())
          .catch(console.error);

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  shape: { borderRadius: 6 },
  palette: {
    background: {
      default: grey['200'],
    },
  },
});

const Main = () => (
  <Suspense fallback={<div />}>
    <SWRConfig
      value={{
        suspense: true,
        fetcher,
        refreshInterval: 0,
        revalidateOnFocus: false, // Don't refetch when window regains focus
        revalidateOnReconnect: false, // Don't refetch when network reconnects
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        errorRetryCount: 1, // Only retry once on error
        errorRetryInterval: 5000, // Wait 5 seconds before retry
        // Show mock data indicator in development
        onError: (error) => {
          if (process.env.NODE_ENV === 'development') {
          }
        },
      }}>
      <ThemeProvider theme={theme}>
        <ConstantsProvider>
          <MapProvider>
            <CssBaseline />
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}>
              <App />
            </Router>
          </MapProvider>
        </ConstantsProvider>
      </ThemeProvider>
    </SWRConfig>
  </Suspense>
);

const root = createRoot(rootElement);
root.render(<Main />);

serviceWorker.unregister();
