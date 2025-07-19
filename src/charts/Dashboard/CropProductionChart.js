import React from 'react';
import { Box } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

import { CROP_COLORS } from '../../constants';
import { readableNumber } from '../../helpers';

const CropProductionChart = ({ values, cropCode }) => {
  return (
    <Box style={{ height: 320 }}>
      <ResponsiveBar
        data={values}
        keys={['value']}
        indexBy="year"
        margin={{ top: 36, right: 36, bottom: 42, left: 54 }}
        padding={0.4}
        colors={CROP_COLORS[cropCode]}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Year',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Production',
          legendPosition: 'middle',
          legendOffset: -48,
          format: readableNumber,
        }}
        enableLabel={false}
        animate
        motionStiffness={90}
        motionDamping={15}
        theme={{ fontFamily: 'Poppins, sans-serif' }}
        tooltipFormat={readableNumber}
      />
    </Box>
  );
};

export default CropProductionChart;
