import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import CategorySummaryChart from '../charts/Dashboard/CategorySummaryChart';

const CategorySummary = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box padding={4} flex={1}>
      <Header title="SBU Summary" />
      <Box>
        <SuspenseProgress>
          <CategorySummaryChart expanded={expanded} />
        </SuspenseProgress>
      </Box>
      <Header
        title=""
        actions={
          <Button
            variant="contained"
            size="small"
            disableElevation
            color="primary"
            onClick={() => setExpanded(!expanded)}>
            {expanded ? 'View Less' : 'View More'}
          </Button>
        }
      />
    </Box>
  );
};

export default CategorySummary;