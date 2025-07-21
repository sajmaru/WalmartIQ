// src/charts/Dashboard/TopSbuChart.js
import React, { memo } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveLine } from '@nivo/line';
import Disclaimer from '../../components/Disclaimer';

import { SBU_COLORS } from '../../constants';
import { readableNumber } from '../../helpers';

export const TopSbuChart = memo(({ sales, years, sbu }) => {
  return (
    <>
      <Box style={{ height: 220 }}>
        <ResponsiveLine
          data={[
            {
              id: 'Sales:',
              data: sales.map((value, index) => ({
                x: years[index],
                y: value,
              })),
              color: SBU_COLORS[sbu],
            },
          ]}
          margin={{ top: 24, right: 24, bottom: 46, left: 60 }}
          yScale={{
            type: 'linear',
            min: 'auto',
          }}
          curve="monotoneX"
          lineWidth={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            tickValues: 5,
            legend: 'Year',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            tickValues: 5,
            legend: 'Sales ($M)',
            legendOffset: -50,
            legendPosition: 'middle',
            format: (value) => `$${readableNumber(value / 1000000)}M`,
          }}
          theme={{ fontFamily: 'Poppins, sans-serif' }}
          isInteractive
          useMesh
          colors={{ datum: 'color' }}
          enablePoints
          pointSize={10}
          pointColor="#FFFFFF"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          legends={[]}
          enableGridX={false}
          gridYValues={5}
          yFormat={(value) => `$${readableNumber(value / 1000000)}M`}
        />
      </Box>
      <Disclaimer />
    </>
  );
});

export default TopSbuChart;