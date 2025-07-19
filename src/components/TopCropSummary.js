import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import TopCropCharts from '../charts/Dashboard/TopCropCharts';

const TopCropSummary = () => {
  const [expanded, setExpanded] = useState();

  return (
    <Box padding={4} flex={1}>
      <Header title="Top Crops" />
      <SuspenseProgress>
        <TopCropCharts {...{ expanded }} />
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

export default TopCropSummary;
