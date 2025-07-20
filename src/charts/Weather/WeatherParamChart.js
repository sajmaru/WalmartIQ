import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveLine } from '@nivo/line';
import { BasicTooltip } from '@nivo/tooltip';
import Disclaimer from '../../components/Disclaimer';
import { WEATHER_COLORS, WEATHER_PARAMS, WEATHER_UNITS } from '../../constants';
import { readableNumber } from '../../helpers';

const WeatherParamChart = ({ on, series }) => {
  const renderTooltip = useCallback(
    ({
      point: {
        color,
        data: { xFormatted, yFormatted },
      },
    }) => {
      return (
        <BasicTooltip
          color={color}
          id={`${xFormatted} ${WEATHER_PARAMS[on]}`}
          enableChip
          value={`${yFormatted} ${WEATHER_UNITS[on]}`}
        />
      );
    },
    [on],
  );

  return (
    <>
      <Box style={{ height: 300 }}>
        <ResponsiveLine
          data={[
            { id: WEATHER_PARAMS[on], data: series, color: WEATHER_COLORS[on] },
          ]}
          margin={{ top: 12, bottom: 48, left: 56, right: 24 }}
          colors={{ datum: 'color' }}
          xScale={{
            type: 'time',
            format: '%d-%m-%Y',
            useUTC: false,
            precision: 'month',
          }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
          }}
          yFormat={readableNumber}
          xFormat="time:%b-%Y"
          curve="monotoneX"
          lineWidth={3}
          axisBottom={{
            format: '%b-%Y',
            orient: 'bottom',
            tickSize: 5,
            legend: 'Time',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            tickValues: 5,
            legend: WEATHER_PARAMS[on],
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          enableGridX={false}
          enableGridY
          enablePoints={false}
          useMesh
          tooltip={renderTooltip}
          theme={{ fontFamily: 'Poppins, sans-serif' }}
        />
      </Box>
      <Disclaimer />
    </>
  );
};

export default WeatherParamChart;
