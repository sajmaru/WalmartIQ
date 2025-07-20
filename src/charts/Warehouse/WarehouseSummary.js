import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import SuspenseProgress from '../../components/SuspenseProgress';
import useRouting from '../../routes/useRouting';
import { API_HOST_URL, INDIA_STATE_CODE } from '../../constants';
import { readableNumber } from '../../helpers';
import WarehouseTable from './WarehouseTable';

const WarehouseSummary = () => {
  const { stateCode = INDIA_STATE_CODE } = useRouting();
  const { data: values } = useSWR(
    `${API_HOST_URL}api/storage/getStorageTotal?stateCode=${stateCode}`,
  );

  return (
    <AnimatedEnter>
      <Grid container spacing={1}>
        {values.map(({ type, count, capacity }, index) => (
          <Grid
            item
            lg={4}
            md={6}
            sm={12}
            xs={12}
            key={`warehouse-summary-${type}-${index}`}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{type}</Typography>
                <Typography variant="body1">
                  <b>Count:</b> {count}
                </Typography>
                <Typography variant="body1">
                  <b>Capacity:</b> {readableNumber(capacity)} Tonnes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <SuspenseProgress>
            <WarehouseTable />
          </SuspenseProgress>
        </Grid>
      </Grid>
    </AnimatedEnter>
  );
};
export default WarehouseSummary;

