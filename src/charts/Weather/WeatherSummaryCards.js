import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import SuspenseProgress from '../../components/SuspenseProgress';
import DynamicText from '../../components/DynamicText';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';
import WeatherTable from './WeatherTable';
import {
  API_HOST_URL,
  INDIA_STATE_CODE,
  WEATHER_PARAMS,
  WEATHER_UNITS,
} from '../../constants';
import { readableNumber } from '../../helpers';

const WeatherSummaryCards = () => {
  const { LATEST_YEAR } = useConstants();
  const { stateCode = INDIA_STATE_CODE, year = LATEST_YEAR } = useRouting();
  const { data: values = [] } = useSWR(
    `${API_HOST_URL}api/weather/getWeatherDataCard?stateCode=${stateCode}&year=${year}`,
    {
      fallbackData: [],
      onError: (err) => console.log('🎭 Using fallback weather card data due to:', err.message)
    }
  );

  const theme = useTheme();

  return (
    <AnimatedEnter>
      <Grid container spacing={1}>
        {/* FIX: Add unique key prop using param as identifier */}
        {values.map(({ param, value, change }, index) => (
          <Grid item lg={3} md={3} sm={6} xs={6} key={`weather-card-${param}-${index}`}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline">
                  <DynamicText>{WEATHER_PARAMS[param]}</DynamicText>
                </Typography>
                <Box textAlign="right">
                  <Typography
                    variant="body1"
                    component="span"
                    style={{
                      color:
                        change < 0
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                      marginRight: theme.spacing(1),
                    }}>
                    {(change < 0 ? '-' : '+') + Math.abs(change)}%
                  </Typography>
                  <Typography variant="h5" component="span">
                    {readableNumber(value) + (WEATHER_UNITS[param] || '')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <SuspenseProgress>
            <WeatherTable />
          </SuspenseProgress>
        </Grid>
      </Grid>
    </AnimatedEnter>
  );
};

export default WeatherSummaryCards;