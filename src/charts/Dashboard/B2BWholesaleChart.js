// src/charts/Dashboard/B2BWholesaleChart.js
import React, { useMemo, useCallback } from 'react';
import { Grid, Box, Typography, Card, CardContent } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { API_HOST_URL } from '../../constants';
import { readableNumber } from '../../helpers';

const B2BWholesaleChart = ({ by, year }) => {
  const { data } = useSWR(
    `${API_HOST_URL}api/dashboard/b2bwholesale?by=${by}&year=${year}`,
  );

  const [b2bData, wholesaleData] = useMemo(() => {
    const sortedB2B = data.b2b.data
      .sort((x, y) => y.value - x.value)
      .map(({ label, value }) => ({ id: label, label, value }));
    const sortedWholesale = data.wholesale.data
      .sort((x, y) => y.value - x.value)
      .map(({ label, value }) => ({ id: label, label, value }));

    return [
      [
        ...sortedB2B.slice(0, 5),
        {
          id: 'Others',
          label: 'Others',
          value: sortedB2B
            .slice(5)
            .reduce((accOthers, { value }) => accOthers + value, 0),
        },
      ],
      [
        ...sortedWholesale.slice(0, 5),
        {
          id: 'Others',
          label: 'Others',
          value: sortedWholesale
            .slice(5)
            .reduce((accOthers, { value }) => accOthers + value, 0),
        },
      ],
    ];
  }, [data]);

  const tooltip = useCallback(({ label, value }) => {
    return (
      <Box display="flex" justifyContent="center">
        <b>{`${label}:`}</b> ${readableNumber(value / 1000000)}M
      </Box>
    );
  }, []);

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">B2B Sales</Typography>
              <Box style={{ height: 360 }}>
                <ResponsivePie
                  {...{ tooltip }}
                  animate
                  data={b2bData}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={{ scheme: 'set3' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
                  enableSlicesLabels={false}
                  radialLabelsLinkColor={{
                    from: 'color',
                    modifiers: [['darker', 0.5]],
                  }}
                  theme={{ fontFamily: 'Poppins, sans-serif', fontSize: 14 }}
                />
              </Box>
              <Disclaimer />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Wholesale</Typography>
              <Box style={{ height: 360 }}>
                <ResponsivePie
                  {...{ tooltip }}
                  animate
                  data={wholesaleData}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={{ scheme: 'set3' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
                  enableSlicesLabels={false}
                  radialLabelsLinkColor={{
                    from: 'color',
                    modifiers: [['darker', 0.5]],
                  }}
                  theme={{ fontFamily: 'Poppins, sans-serif', fontSize: 14 }}
                />
              </Box>
              <Disclaimer />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AnimatedEnter>
  );
};

export default B2BWholesaleChart;