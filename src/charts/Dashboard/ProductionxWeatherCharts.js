import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import useSWR from 'swr';

import CropProductionChart from './CropProductionChart';
import useRouting from '../../routes/useRouting';
import useContants from '../../hooks/useConstants';

import { INDIA_STATE_CODE, API_HOST_URL } from '../../constants';
import WeatherChart from './WeatherChart';

const weatherConstants = {
  prep: 'Precipitation',
  temp: 'Temperature',
  clco: 'Cloud Cover',
  evpt: 'Evapotranspiration',
  pasm: 'Soil Moisture',
};

const ProductionxWeatherCharts = ({ on, weatherParam }) => {
  const { LATEST_YEAR } = useContants();
  const {
    stateCode = INDIA_STATE_CODE,
    cropCode,
    year = LATEST_YEAR,
  } = useRouting();

  const { data } = useSWR(
    `${API_HOST_URL}api/data/getCropVsWeather?year=${year}&stateCode=${stateCode}&n=8&on=${on}&cropCode=${cropCode}`,
  );

  const weatherData = useMemo(() => {
    if (!weatherParam || data.length === 0) return [];

    return [
      {
        id: weatherConstants[weatherParam],
        data: data[0][weatherParam].map(({ year: yr, value }) => ({
          x: yr,
          y: value,
        })),
      },
    ];
  }, [weatherParam, data]);

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} lg={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6">Production</Typography>
            {data.length > 0 ? (
              <CropProductionChart
                values={data[0].values}
                cropCode={cropCode}
              />
            ) : (
              <Typography variant="caption">*data yet to be loaded</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6">Weather</Typography>
            {data.length > 0 ? (
              <WeatherChart values={weatherData} {...{ weatherParam }} />
            ) : (
              <Typography variant="caption">*data yet to be loaded</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductionxWeatherCharts;
