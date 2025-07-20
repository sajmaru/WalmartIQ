import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const RateSummaryCard = ({ insights }) => {
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
          <Typography variant="overline">Rainfall</Typography>
          {insights.rainfall.map((text, index) => (
            <Typography key={`rainfall-${index}`} variant="body2">{text}</Typography>
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
          <Typography variant="overline">Consumption</Typography>
          {insights.consumption.map((text, index) => (
            <Typography key={`consumption-${index}`} variant="body2">{text}</Typography>
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
          <Typography variant="overline">Rates</Typography>
          {insights.rates.map((text, index) => (
            <Typography key={`rates-${index}`} variant="body2">{text}</Typography>
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
          <Typography variant="overline">Production</Typography>
          {insights.production.map((text, index) => (
            <Typography key={`production-${index}`} variant="body2">{text}</Typography>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default RateSummaryCard;