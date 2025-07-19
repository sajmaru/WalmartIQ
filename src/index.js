import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import grey from '@material-ui/core/colors/grey';
import { MapProvider } from './context/Maps';
import { ConstantsProvider } from './context/Constants';

import * as serviceWorker from './serviceWorker';

import './index.css';

const App = lazy(() => import('./App'));
const rootElement = document.getElementById('root');

const fetcher = (...args) =>
  fetch(...args)
    .then((response) => response.json())
    .catch(console.error);

const theme = createMuiTheme({
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
    <SWRConfig value={{ suspense: true, fetcher, refreshInterval: 0 }}>
      <ThemeProvider {...{ theme }}>
        <ConstantsProvider>
          <MapProvider>
            <CssBaseline />
            <Router>
              <App />
            </Router>
          </MapProvider>
        </ConstantsProvider>
      </ThemeProvider>
    </SWRConfig>
  </Suspense>
);

render(<Main />, rootElement);

serviceWorker.unregister();
