// src/App.js - Complete updated version
import React, { Suspense, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
import Navbar, { NAVBAR_WIDTH } from './components/Navbar';
import Router from './routes/Router';
import ErrorBoundary from './components/ErrorBoundary';
import ChatPanel from './components/ChatPanel'; // ADD THIS IMPORT
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
    transition: theme.transitions.create(['margin-left', 'margin-right'], {
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
  // ADD THIS NEW CLASS
  ContentWithChat: ({ chatPanelWidth }) => ({
    marginRight: chatPanelWidth || 0,
  }),
}));

const App = () => {
  // ADD THIS STATE
  const [chatPanelWidth, setChatPanelWidth] = useState(0);
  
  const styles = useAppStyles({ chatPanelWidth }); // PASS chatPanelWidth
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

  // ADD THIS HANDLER
  const handleChatPanelResize = (width, isOpen) => {
    console.log('🎯 Chat panel resize:', { width, isOpen }); // Debug log
    setChatPanelWidth(isOpen ? width : 0);
  };

  return (
    <ErrorBoundary>
      <Box className={styles.Container}>
        <Navbar />
        <Suspense fallback={<div />}>
          <Box 
            className={`${styles.Content} ${
              isWelcomePage ? styles.ContentFullWidth : styles.ContentWithNavbar
            } ${chatPanelWidth > 0 ? styles.ContentWithChat : ''}`}
          >
            <AnimatePresence mode="wait">
              <Router />
            </AnimatePresence>
          </Box>
        </Suspense>
        
        {/* ADD THIS CHATPANEL COMPONENT */}
        {!isWelcomePage && (
          <ChatPanel onResize={handleChatPanelResize} />
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default App;