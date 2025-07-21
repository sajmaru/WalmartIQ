// src/charts/Pricing/PricingInsights.js
import React from 'react';
import {
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import { API_HOST_URL } from '../../constants';
import PredictedPricingChart from './PredictedPricingChart';
import PricingSummaryCard from '../../components/PricingSummaryCard';

const PricingInsights = () => {
  const theme = useTheme();
  const { data } = useSWR(`${API_HOST_URL}api/pricing/pricingSummary`);

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        {data.map(({ sbu, years, avgPrice, insights }, index) => (
          <Grid item xs={12} md={6} key={`pricing-insight-${sbu}-${index}`}>
            <Card variant="outlined" style={{ overflow: 'visible' }}>
              <CardContent>
                <Typography variant="h6">{sbu}</Typography>
                <PredictedPricingChart
                  prices={avgPrice}
                  years={years}
                  color={theme.palette.primary.dark}
                />
                <PricingSummaryCard insights={insights} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AnimatedEnter>
  );
};

export default PricingInsights;