// src/components/TopSbuSummary.js
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import TopSbuCharts from '../charts/Dashboard/TopSbuCharts';

const TopSbuSummary = () => {
  const [expanded, setExpanded] = useState();

  return (
    <Box padding={4} flex={1}>
      <Header title="Top SBUs" />
      <SuspenseProgress>
        <TopSbuCharts {...{ expanded }} />
      </SuspenseProgress>
      <Header
        title=""
        actions={
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => setExpanded((oldExpanded) => !oldExpanded)}
            size="small">
            {expanded ? 'View Less' : 'View More'}
          </Button>
        }
      />
    </Box>
  );
};

export default TopSbuSummary;

