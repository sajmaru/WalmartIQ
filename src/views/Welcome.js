import React from 'react';
import { Box, Typography, Card } from '@mui/material';

import { NAVBAR_WIDTH } from '../components/Navbar';
import LitCrops from '../assets/LitCrops';
import useRouting from '../routes/useRouting';

const Welcome = () => {
  const { goTo } = useRouting();
  return (
    <Box
      style={{
        marginLeft: -NAVBAR_WIDTH,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography variant="h1">
        <LitCrops /> USAPA
      </Typography>
      <Typography variant="h5">
        Unified System for Agricultural Prediction using Artificial Intelligence
      </Typography>
      <Box style={{ marginTop: 108, display: 'flex', flexDirection: 'row' }}>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Crop Yield/Production</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/weather')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Weather</Typography>
          </Box>
        </Card>

        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/warehouse')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Warehousing</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/rates')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Crop Rates</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/directory')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Budget</Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Welcome;
