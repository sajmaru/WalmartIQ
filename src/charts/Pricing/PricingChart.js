// src/charts/Pricing/PricingChart.js
import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import { BasicTooltip } from '@nivo/tooltip';
import { ResponsiveLine } from '@nivo/line';
import Disclaimer from '../../components/Disclaimer';
import { readableNumber } from '../../helpers';

const PricingChart = ({ series, color }) => {
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
          id={`${xFormatted} Price`}
          enableChip
          value={`$${yFormatted}`}
        />
      );
    },
    [],
  );
  return (
    <>
      <Box height={220}>
        <ResponsiveLine
          data={[{ id: 'Price', color: color || '#303030', data: series }]}
          margin={{ top: 12, bottom: 48, left: 48, right: 24 }}
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
          colors={{ datum: 'color' }}
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
            tickValues: 'every year',
          }}
          axisLeft={{
            format: readableNumber,
            orient: 'left',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            tickValues: 5,
            legend: 'Price ($)',
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

export default PricingChart;