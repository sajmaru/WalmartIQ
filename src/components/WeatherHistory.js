import React from 'react';
import { MenuItem, Box } from '@material-ui/core';
import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import useInput from '../hooks/useInput';
import { WEATHER_PARAMS } from '../constants';
import WeatherCharts from '../charts/Weather/WeatherCharts';

const WeatherHistory = () => {
  const on = useInput('temp');
  const numYears = useInput(3);

  return (
    <Box padding={4}>
      <Header
        title="Trend Visualization"
        actions={
          <>
            <Select {...on.bind} dense>
              {Object.entries(WEATHER_PARAMS).map(([value, name]) => (
                <MenuItem value={value} key={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Select {...numYears.bind} dense>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((name) => (
                <MenuItem value={name} key={name}>
                  {name} {name > 1 ? 'years' : 'year'}
                </MenuItem>
              ))}
            </Select>
          </>
        }
      />
      <SuspenseProgress>
        <WeatherCharts on={on.value} n={numYears.value} />
      </SuspenseProgress>
    </Box>
  );
};

export default WeatherHistory;
