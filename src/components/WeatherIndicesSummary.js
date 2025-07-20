import React, { useState } from 'react';
import { Box, Grid, MenuItem } from '@mui/material';
import WeatherIndicesMap from '../charts/Weather/WeatherIndicesMap';
import WeatherIndicesTable from '../charts/Weather/WeatherIndicesTable';
import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import useInput from '../hooks/useInput';
import { WEATHER_INDICES } from '../constants';

const WeatherIndicesSummary = () => {
  const on = useInput('pasm');

  const [mapHeight, setMapHeight] = useState();

  return (
    <Box padding={3}>
      <Header
        title="Other Meteorological Parameters"
        actions={
          <Select id="weather-param-select" dense {...on.bind}>
            {Object.entries(WEATHER_INDICES).map(([value, name]) => (
              <MenuItem key={value} value={value}>{name}</MenuItem>
            ))}
          </Select>
        }
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <SuspenseProgress minHeight={mapHeight}>
            <WeatherIndicesTable on={on.value} />
          </SuspenseProgress>
        </Grid>
        <Grid item xs={12} md={5}>
          <SuspenseProgress minHeight={mapHeight}>
            <WeatherIndicesMap on={on.value} setMapHeight={setMapHeight} />
          </SuspenseProgress>
        </Grid>
      </Grid>
    </Box>
  );
};
export default WeatherIndicesSummary;