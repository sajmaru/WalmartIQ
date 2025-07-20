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
import PredictedRateChart from './PredictedRateChart';
import RateSummaryCard from '../../components/RateSummaryCard';

const RateInsights = () => {
  const theme = useTheme();
  const { data } = useSWR(`${API_HOST_URL}api/rates/ratesSummary`);

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        {data.map(({ crop, years, rates, insights }, index) => (
          <Grid item xs={12} md={6} key={`rate-insight-${crop}-${index}`}>
            <Card variant="outlined" style={{ overflow: 'visible' }}>
              <CardContent>
                <Typography variant="h6">{crop}</Typography>
                <PredictedRateChart
                  rates={rates}
                  years={years}
                  color={theme.palette.primary.dark}
                />
                <RateSummaryCard insights={insights} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AnimatedEnter>
  );
};

export default RateInsights;