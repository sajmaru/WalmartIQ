import React from 'react';
import { Button, Box, ButtonGroup, MenuItem } from '@mui/material';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import ProductionxWeatherCharts from '../charts/Dashboard/ProductionxWeatherCharts';
import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import useInput from '../hooks/useInput';

const weatherConstants = {
  temp: 'Temperature',
  clco: 'Cloud Cover',
  evpt: 'Evapotranspiration',
  prep: 'Precipitation',
  pasm: 'Soil Moisture',
};

const ProductionxWeather = () => {
  const on = useButtonGroupSelect('production');
  const weatherParam = useInput('prep');

  return (
    <Box padding={4} flex={1}>
      <Header
        title="Statistics"
        actions={
          <>
            <ButtonGroup disableElevation size="small">
              {Object.entries({ production: 'Production', yield: 'yield' }).map(
                ([value, label]) => (
                  <Button
                    variant="contained"
                    color={on.value === value ? 'primary' : 'default'}
                    {...on.bind(value)}>
                    {label}
                  </Button>
                ),
              )}
            </ButtonGroup>
            <Select id="weather-param-select" {...weatherParam.bind} dense>
              {Object.entries(weatherConstants).map(([value, name]) => (
                <MenuItem value={value} key={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </>
        }
      />
      <Box>
        <SuspenseProgress>
          <ProductionxWeatherCharts
            on={on.value}
            weatherParam={weatherParam.value}
          />
        </SuspenseProgress>
      </Box>
    </Box>
  );
};

export default ProductionxWeather;
