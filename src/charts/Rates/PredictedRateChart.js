import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import { ResponsiveLine } from '@nivo/line';
import Disclaimer from '../../components/Disclaimer';

import { readableNumber } from '../../helpers';

const PredictedRateChart = memo(({ rates, years, color }) => {
  return (
    <>
      <Box style={{ height: 220 }}>
        <ResponsiveLine
          data={[
            {
              id: 'Rates:',
              data: rates.map((value, index) => ({
                x: years[index],
                y: value,
              })),
              color,
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
            legend: 'Rates',
            legendOffset: -50,
            legendPosition: 'middle',
            format: readableNumber,
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
          yFormat={readableNumber}
        />
      </Box>
      <Disclaimer />
    </>
  );
});

export default PredictedRateChart;
