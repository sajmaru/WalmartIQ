import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const SuspenseProgress = ({ minHeight, children, style, ...props }) => (
  <Suspense
    fallback={
      <Box
        style={{
          minHeight: minHeight || 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}
        {...props}>
        <CircularProgress />
      </Box>
    }>
    {children}
  </Suspense>
);

export default SuspenseProgress;
