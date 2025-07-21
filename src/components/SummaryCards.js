import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const SummaryCards = ({ content }) => {
  // Handle case where content might be undefined or have different structure
  if (!content) {
    return null;
  }

  // Handle sales data structure - content.sales instead of content.production
  const salesInsights = content.sales || content.production || [];
  
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
          <Typography variant="body2">
            {salesInsights[0] || 'Performance data available'}
          </Typography>
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
          <Typography variant="body2">
            {salesInsights[1] || 'Growth trends positive'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;