import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@material-ui/core';
import useTheme from '@material-ui/styles/useTheme';

import MiniGraph from './MiniGraph';
import Disclaimer from './Disclaimer';
import DynamicText from './DynamicText';

import { readableNumber } from '../helpers';

const CategoryCard = ({ categoryName, production, consumption }) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ overflow: 'visible' }}>
      <Typography
        variant="h6"
        style={{
          marginLeft: 16,
          marginRight: 16,
          marginTop: 10,
          marginBottom: 10,
        }}>
        {categoryName}
      </Typography>
      <Divider />
      <CardContent
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}>
        {consumption && (
          <>
            <Box
              display="flex"
              flex={1}
              marginBottom={1}
              style={{ marginTop: -10 }}>
              <MiniGraph
                series={consumption.series}
                years={consumption.year}
                color="#424651"
              />
              <Box>
                <Typography variant="overline">
                  <DynamicText>Consumption</DynamicText>
                </Typography>
                <Typography
                  variant="h6"
                  align="right"
                  style={{
                    color:
                      consumption.series[consumption.series.length - 1] <
                      consumption.series[consumption.series.length - 2]
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  }}>
                  {consumption.series[consumption.series.length - 1] <
                  consumption.series[consumption.series.length - 2]
                    ? `-${consumption.change}%`
                    : `+${consumption.change}%`}
                </Typography>
                <Typography variant="h5" align="right">
                  {readableNumber(consumption.value)}
                </Typography>
                <Typography variant="body1" align="right">
                  Tonnes
                </Typography>
              </Box>
            </Box>
            <Divider />
          </>
        )}
        <Box display="flex" flex={1} marginTop={consumption ? 1 : 0}>
          <Box
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            <Box>
              <Typography variant="overline">
                <DynamicText>Production</DynamicText>
              </Typography>
              <Typography
                variant="h6"
                align="left"
                style={{
                  color:
                    production.series[production.series.length - 1] <
                    production.series[production.series.length - 2]
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                }}>
                {production.series[production.series.length - 1] <
                production.series[production.series.length - 2]
                  ? `-${production.change}%`
                  : `+${production.change}%`}
              </Typography>
              <Typography variant="h5" align="left">
                {readableNumber(production.value)}
              </Typography>
              <Typography variant="body1" align="left">
                Tonnes
              </Typography>
            </Box>
          </Box>
          <MiniGraph series={production.series} years={production.year} />
        </Box>
        <Disclaimer />
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
