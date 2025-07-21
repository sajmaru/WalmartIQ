// / src/charts/Dashboard/MarketChart.js
import { Box } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';

const MARKET_COLORS = {
  marketIndex: '#2196F3',
  consumerSentiment: '#4CAF50',
  competitorIndex: '#FF9800',
  economicIndex: '#9C27B0',
};

const MarketChart = ({ values, marketParam }) => {
  return (
    <Box style={{ height: 320 }}>
      <ResponsiveLine
        data={[
          {
            ...values[0],
            color: MARKET_COLORS[marketParam] || '#E71D36',
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
          legend: 'Index Value',
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

export default MarketChart;