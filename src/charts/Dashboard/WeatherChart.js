import React from 'react';
import { Box } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import { WEATHER_COLORS } from '../../constants';

const WeatherChart = ({ values, weatherParam }) => {
  return (
    <Box style={{ height: 320 }}>
      <ResponsiveLine
        data={[
          {
            ...values[0],
            color: WEATHER_COLORS[weatherParam]
              ? WEATHER_COLORS[weatherParam]
              : '#E71D36',
          },
        ]}
        margin={{ top: 36, right: 36, bottom: 42, left: 58 }}
        curve="monotoneX"
        yScale={{
          type: 'linear',
          min: 'auto',
        }}
        lineWidth={3}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Year',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendOffset: -52,
          legendPosition: 'middle',
        }}
        animate
        theme={{ fontFamily: 'Poppins, sans-serif' }}
        colors={{ datum: 'color' }}
        pointSize={10}
        pointColor="#FFFFFF"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh
      />
    </Box>
  );
};

export default WeatherChart;
