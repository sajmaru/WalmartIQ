import { Box, Card, CardContent } from '@mui/material';
import { useMemo } from 'react';
import useSWR from 'swr';
import { API_HOST_URL, USA_STATE_CODE } from '../../constants';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';
import WeatherParamChart from './WeatherParamChart';

const WeatherCharts = ({ on, n }) => {
  const { LATEST_YEAR } = useConstants();
  const { stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();

  const { data } = useSWR(
    `${API_HOST_URL}api/weather/getWeatherDataTotal?stateCode=${stateCode}&on=${on}&year=${year}&n=${n}`,
  );

  const chartData = useMemo(() => {
    const monthData = data[0].years.reduce(
      (monthArray, { year: yr, series }) => {
        return [
          ...series.map((value, index) => ({
            x: index > 8 ? `01-${index + 1}-${yr}` : `01-0${index + 1}-${yr}`,
            y: value,
          })),
          ...monthArray,
        ];
      },
      [],
    );

    return monthData;
  }, [data]);

  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <WeatherParamChart on={on} series={chartData} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeatherCharts;

