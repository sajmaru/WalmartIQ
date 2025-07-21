import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const PricingSummaryCard = ({ insights }) => {
  return (
    <Grid container spacing={1} style={{ marginTop: 4 }}>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box
          style={{
            backgroundColor: '#B5D2FF',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 8,
            borderRadius: 4,
          }}>
          <Typography variant="overline">Demand</Typography>
          {insights.demand.map((text, index) => (
            <Typography key={`demand-${index}`} variant="body2">{text}</Typography>
          ))}
        </Box>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box
          style={{
            backgroundColor: '#D5FFCD',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 8,
            borderRadius: 4,
          }}>
          <Typography variant="overline">Competition</Typography>
          {insights.competition.map((text, index) => (
            <Typography key={`competition-${index}`} variant="body2">{text}</Typography>
          ))}
        </Box>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box
          style={{
            backgroundColor: '#FDFFC9',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 8,
            borderRadius: 4,
          }}>
          <Typography variant="overline">Pricing</Typography>
          {insights.pricing.map((text, index) => (
            <Typography key={`pricing-${index}`} variant="body2">{text}</Typography>
          ))}
        </Box>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box
          style={{
            backgroundColor: '#FFC1C1',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 8,
            borderRadius: 4,
          }}>
          <Typography variant="overline">Market</Typography>
          {insights.market.map((text, index) => (
            <Typography key={`market-${index}`} variant="body2">{text}</Typography>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default PricingSummaryCard;