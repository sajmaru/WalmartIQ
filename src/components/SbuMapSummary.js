// src/components/SbuMapSummary.js
import React, { useState } from 'react';
import { ButtonGroup, Button, Box, Grid } from '@mui/material';
import SbuMapChart from '../charts/Dashboard/SbuMapChart';
import SalesTable from '../charts/Dashboard/SalesTable';
import SuspenseProgress from './SuspenseProgress';
import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import { SALES_METRICS_NAMES } from '../constants';

const SbuMapSummary = () => {
  const basedOn = useButtonGroupSelect('gmv');
  const [mapHeight, setMapHeight] = useState();

  return (
    <Box padding={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <ButtonGroup disableElevation size="small">
            {Object.entries(SALES_METRICS_NAMES).map(([value, label]) => (
              <Button
                key={`sales-metric-${value}`}
                variant="contained"
                color={basedOn.value === value ? 'primary' : 'default'}
                {...basedOn.bind(value)}>
                {label}
              </Button>
            ))}
          </ButtonGroup>
          <SuspenseProgress minHeight={mapHeight}>
            <SbuMapChart on={basedOn.value} setMapHeight={setMapHeight} />
          </SuspenseProgress>
        </Grid>
        <Grid item xs={12} md={7}>
          <SalesTable />
        </Grid>
      </Grid>
    </Box>
  );
};
export default SbuMapSummary;