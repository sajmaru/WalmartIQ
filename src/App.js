import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
import Navbar, { NAVBAR_WIDTH } from './components/Navbar';
import Router from './routes/Router';
import ErrorBoundary from './components/ErrorBoundary';
import { API_HOST_URL } from './constants';
import useConstants from './hooks/useConstants';

const useAppStyles = makeStyles((theme) => ({
  Container: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
  },
  Content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    transition: theme.transitions.create(['margin-left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  ContentWithNavbar: {
    marginLeft: NAVBAR_WIDTH,
  },
  ContentFullWidth: {
    marginLeft: 0,
  },
}));

const App = () => {
  const styles = useAppStyles();
  const location = useLocation();
  
  // Check if we're on the welcome page
  const isWelcomePage = location.pathname === '/welcome';
  
  // Add error handling for the SWR call
  const { 
    data, 
    error 
  } = useSWR(`${API_HOST_URL}api/dashboard/getYear`, {
    fallbackData: { year: 2023 }, // Provide fallback
    onError: (err) => console.log('🎭 Using fallback year due to:', err.message)
  });
  
  const { LATEST_YEAR, setConstant } = useConstants();

  useEffect(() => {
    const year = data?.year || 2023;
    if (LATEST_YEAR !== year) {
      setConstant('LATEST_YEAR', year);
    }
  }, [data, LATEST_YEAR, setConstant]);

  return (
    <ErrorBoundary>
      <Box className={styles.Container}>
        <Navbar />
        <Suspense fallback={<div />}>
          <Box 
            className={`${styles.Content} ${
              isWelcomePage ? styles.ContentFullWidth : styles.ContentWithNavbar
            }`}
          >
            <AnimatePresence mode="wait">
              <Router />
            </AnimatePresence>
          </Box>
        </Suspense>
      </Box>
    </ErrorBoundary>
  );
};

export default App;