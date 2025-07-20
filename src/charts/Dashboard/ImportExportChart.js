import React, { useMemo, useCallback } from 'react';
import { Grid, Box, Typography, Card, CardContent } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { API_HOST_URL } from '../../constants';
import { readableNumber } from '../../helpers';

const ImportExportChart = ({ by, year }) => {
  const { data } = useSWR(
    `${API_HOST_URL}api/dashboard/importexport?by=${by}&year=${year}`,
  );

  const [importData, exportData] = useMemo(() => {
    const sortedImport = data.import.data
      .sort((x, y) => y.value - x.value)
      .map(({ label, value }) => ({ id: label, label, value }));
    const sortedExport = data.export.data
      .sort((x, y) => y.value - x.value)
      .map(({ label, value }) => ({ id: label, label, value }));

    return [
      [
        ...sortedImport.slice(0, 5),
        {
          id: 'Others',
          label: 'Others',
          value: sortedImport
            .slice(5)
            .reduce((accOthers, { value }) => accOthers + value, 0),
        },
      ],
      [
        ...sortedExport.slice(0, 5),
        {
          id: 'Others',
          label: 'Others',
          value: sortedExport
            .slice(5)
            .reduce((accOthers, { value }) => accOthers + value, 0),
        },
      ],
    ];
  }, [data]);

  const tooltip = useCallback(({ label, value }) => {
    return (
      <Box display="flex" justifyContent="center">
        <b>{`${label}:`}</b> {readableNumber(value)}
      </Box>
    );
  }, []);

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Imports</Typography>
              <Box style={{ height: 360 }}>
                <ResponsivePie
                  {...{ tooltip }}
                  animate
                  data={importData}
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
              <Typography variant="h6">Exports</Typography>
              <Box style={{ height: 360 }}>
                <ResponsivePie
                  {...{ tooltip }}
                  animate
                  data={exportData}
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

export default ImportExportChart;
