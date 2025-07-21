// src/charts/Pricing/PricingHistory.js
import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import useSWR from 'swr';

import PricingChart from './PricingChart';
import { API_HOST_URL } from '../../constants';

const PricingHistory = ({ channel, sbu }) => {
  const theme = useTheme();
  const { data } = useSWR(
    `${API_HOST_URL}api/pricing/getTrends?sbu=${sbu}&channel=${channel}&n=5`,
  );

  const { avgPriceData, marginData } = useMemo(() => {
    return {
      avgPriceData: data.map(({ year, month, avgPrice }) => ({
        x: month < 10 ? `01-0${month}-${year}` : `01-${month}-${year}`,
        y: avgPrice,
      })),
      marginData: data.map(({ year, month, marginPercent }) => ({
        x: month < 10 ? `01-0${month}-${year}` : `01-${month}-${year}`,
        y: marginPercent,
      })),
    };
  }, [data]);

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6" component="span">
              Average Price
            </Typography>{' '}
            <Typography variant="subtitle1" component="span">
              ($)
            </Typography>
            <PricingChart
              series={avgPriceData}
              color={theme.palette.primary.dark}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6" component="span">
              Margin
            </Typography>{' '}
            <Typography variant="subtitle1" component="span">
              (%)
            </Typography>
            <PricingChart series={marginData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PricingHistory;