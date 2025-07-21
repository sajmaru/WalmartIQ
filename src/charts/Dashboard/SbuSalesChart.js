import { Box } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

import { SBU_COLORS } from '../../constants';
import { readableNumber } from '../../helpers';

const SbuSalesChart = ({ values, sbuCode }) => {
  return (
    <Box style={{ height: 320 }}>
      <ResponsiveBar
        data={values}
        keys={['value']}
        indexBy="year"
        margin={{ top: 36, right: 36, bottom: 42, left: 54 }}
        padding={0.4}
        colors={SBU_COLORS[sbuCode]}
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
          legend: 'Sales ($M)',
          legendPosition: 'middle',
          legendOffset: -48,
          format: (value) => `$${readableNumber(value / 1000000)}M`,
        }}
        enableLabel={false}
        animate
        motionStiffness={90}
        motionDamping={15}
        theme={{ fontFamily: 'Poppins, sans-serif' }}
        tooltipFormat={(value) => `$${readableNumber(value / 1000000)}M`}
      />
    </Box>
  );
};

export default SbuSalesChart;