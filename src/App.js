import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import Navbar, { NAVBAR_WIDTH } from './components/Navbar';
import Router from './routes/Router';
import { API_HOST_URL } from './constants';
import useConstants from './hooks/useConstants';

const useAppStyles = makeStyles((theme) => ({
  Container: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  Content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: NAVBAR_WIDTH,
  },
}));

const App = () => {
  const styles = useAppStyles();
  const {
    data: {
      year: { year },
    },
  } = useSWR(`${API_HOST_URL}api/dashboard/getYear`);
  const { LATEST_YEAR, setConstant } = useConstants();

  useEffect(() => {
    if (LATEST_YEAR !== year) setConstant('LATEST_YEAR', year);
  }, [LATEST_YEAR, year, setConstant]);

  return (
    <Box classes={{ root: styles.Container }}>
      <Navbar />
      <Suspense fallback={<div />}>
        <Box classes={{ root: styles.Content }}>
          <AnimatePresence>
            <Router />
          </AnimatePresence>
        </Box>
      </Suspense>
    </Box>
  );
};

export default App;