import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import useTheme from '@mui/styles/useTheme';

import MiniGraph from './MiniGraph';
import Disclaimer from './Disclaimer';
import DynamicText from './DynamicText';

import { readableNumber } from '../helpers';

const CategoryCard = ({ categoryName, sales, orders }) => {
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
        {orders && (
          <>
            <Box
              display="flex"
              flex={1}
              marginBottom={1}
              style={{ marginTop: -10 }}>
              <MiniGraph
                series={orders.series}
                years={orders.year}
                color="#424651"
              />
              <Box>
                <Typography variant="overline">
                  <DynamicText>Orders</DynamicText>
                </Typography>
                <Typography
                  variant="h6"
                  align="right"
                  style={{
                    color:
                      orders.series[orders.series.length - 1] <
                      orders.series[orders.series.length - 2]
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  }}>
                  {orders.series[orders.series.length - 1] <
                  orders.series[orders.series.length - 2]
                    ? `-${orders.change}%`
                    : `+${orders.change}%`}
                </Typography>
                <Typography variant="h5" align="right">
                  {readableNumber(orders.value / 1000)}K
                </Typography>
                <Typography variant="body1" align="right">
                  Orders
                </Typography>
              </Box>
            </Box>
            <Divider />
          </>
        )}
        <Box display="flex" flex={1} marginTop={orders ? 1 : 0}>
          <Box
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            <Box>
              <Typography variant="overline">
                <DynamicText>Sales</DynamicText>
              </Typography>
              <Typography
                variant="h6"
                align="left"
                style={{
                  color:
                    sales.series[sales.series.length - 1] <
                    sales.series[sales.series.length - 2]
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                }}>
                {sales.series[sales.series.length - 1] <
                sales.series[sales.series.length - 2]
                  ? `-${sales.change}%`
                  : `+${sales.change}%`}
              </Typography>
              <Typography variant="h5" align="left">
                ${readableNumber(sales.value / 1000000)}M
              </Typography>
              <Typography variant="body1" align="left">
                Revenue
              </Typography>
            </Box>
          </Box>
          <MiniGraph series={sales.series} years={sales.year} />
        </Box>
        <Disclaimer />
      </CardContent>
    </Card>
  );
};

export default CategoryCard;