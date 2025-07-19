import React, { useState } from 'react';
import { ButtonGroup, Button, Box, Grid } from '@material-ui/core';
import CropMapChart from '../charts/Dashboard/CropMapChart';
import ProductionTable from '../charts/Dashboard/ProductionTable';
import SuspenseProgress from './SuspenseProgress';
import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import { CROP_METRICS_NAMES } from '../constants';

const CropMapSummary = () => {
  const basedOn = useButtonGroupSelect('production');
  const [mapHeight, setMapHeight] = useState();

  return (
    <Box padding={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <ButtonGroup disableElevation size="small">
            {Object.entries(CROP_METRICS_NAMES).map(([value, label]) => (
              <Button
                variant="contained"
                color={basedOn.value === value ? 'primary' : 'default'}
                {...basedOn.bind(value)}>
                {label}
              </Button>
            ))}
          </ButtonGroup>
          <SuspenseProgress minHeight={mapHeight}>
            <CropMapChart on={basedOn.value} setMapHeight={setMapHeight} />
          </SuspenseProgress>
        </Grid>
        <Grid item xs={12} md={7}>
          <ProductionTable />
        </Grid>
      </Grid>
    </Box>
  );
};
export default CropMapSummary;
