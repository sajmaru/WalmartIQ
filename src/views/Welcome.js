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
        Unified Sales Analytics & Performance Assessment
      </Typography>
      <Box style={{ marginTop: 108, display: 'flex', flexDirection: 'row' }}>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Sales Performance</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/weather')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Market Conditions</Typography>
          </Box>
        </Card>

        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/warehouse')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Distribution</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/pricing')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Pricing Analytics</Typography>
          </Box>
        </Card>
        <Card
          style={{ cursor: 'pointer', margin: 12 }}
          onClick={() => goTo({}, '/directory')}>
          <Box style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h5">Reports</Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Welcome;