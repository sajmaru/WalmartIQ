import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import useSWR from 'swr';

import RatesChart from './RatesChart';
import { API_HOST_URL } from '../../constants';

const RatesHistory = ({ center, commodity }) => {
  const theme = useTheme();
  const { data } = useSWR(
    `${API_HOST_URL}api/rates/getTrends?commodityCode=${commodity}&center=${center}&n=5`,
  );

  const { wholesaleData, retailData } = useMemo(() => {
    return {
      wholesaleData: data.map(({ year, month, wholesaleRate }) => ({
        x: month < 10 ? `01-0${month}-${year}` : `01-${month}-${year}`,
        y: wholesaleRate,
      })),
      retailData: data.map(({ year, month, retailRate }) => ({
        x: month < 10 ? `01-0${month}-${year}` : `01-${month}-${year}`,
        y: retailRate,
      })),
    };
  }, [data]);

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6" component="span">
              Wholesale Rates
            </Typography>{' '}
            <Typography variant="subtitle1" component="span">
              (₹/quintal)
            </Typography>
            <RatesChart
              series={wholesaleData}
              color={theme.palette.primary.dark}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6" component="span">
              Retail Rates
            </Typography>{' '}
            <Typography variant="subtitle1" component="span">
              (₹/kg)
            </Typography>
            <RatesChart series={retailData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RatesHistory;
