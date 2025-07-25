import React, { useState } from 'react';
import { Box, Grid, MenuItem } from '@mui/material';
import WeatherMap from '../charts/Weather/WeatherMap';
import WeatherSummaryCards from '../charts/Weather/WeatherSummaryCards';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import useInput from '../hooks/useInput';
import { ALL_MONTHS_VALUE, WEATHER_PARAMS, MONTH_NAMES } from '../constants';

const WeatherMapSummary = () => {
  const on = useInput('prep');
  const month = useInput(ALL_MONTHS_VALUE);

  const [mapHeight, setMapHeight] = useState();

  return (
    <Box padding={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Select id="weather-param-select" dense {...on.bind}>
              {Object.entries(WEATHER_PARAMS).map(([value, name]) => (
                <MenuItem key={value} value={value}>{name}</MenuItem>
              ))}
            </Select>
            <Select id="month-select" dense {...month.bind}>
              <MenuItem key={ALL_MONTHS_VALUE} value={ALL_MONTHS_VALUE}>All months</MenuItem>
              {MONTH_NAMES.map((m, index) => (
                <MenuItem key={index} value={index}>{m}</MenuItem>
              ))}
            </Select>
          </Box>
          <SuspenseProgress minHeight={mapHeight}>
            <WeatherMap
              on={on.value}
              month={month.value}
              setMapHeight={setMapHeight}
            />
          </SuspenseProgress>
        </Grid>
        <Grid item xs={12} md={7}>
          <WeatherSummaryCards />
        </Grid>
      </Grid>
    </Box>
  );
};
export default WeatherMapSummary;