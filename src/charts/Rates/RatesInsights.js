import React from 'react';
import {
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import { API_HOST_URL } from '../../constants';
import PredictedRateChart from './PredictedRateChart';
import RateSummaryCard from '../../components/RateSummaryCard';

const RateInsights = () => {
  const theme = useTheme();
  const { data } = useSWR(`${API_HOST_URL}api/rates/ratesSummary`);

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        {data.map(({ crop, years, rates, insights }) => (
          <Grid item xs={12} md={6}>
            <Card variant="outlined" style={{ overflow: 'visible' }}>
              <CardContent>
                <Typography variant="h6">{crop}</Typography>
                <PredictedRateChart
                  {...{ rates }}
                  {...{ years }}
                  color={theme.palette.primary.dark}
                />
                <RateSummaryCard {...{ insights }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AnimatedEnter>
  );
};

export default RateInsights;
