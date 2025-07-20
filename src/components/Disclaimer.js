import React from 'react';
import { Box, Typography } from '@mui/material';

import { DISCLAIMER } from '../constants';

const Disclaimer = () => (
  <Box textAlign="right">
    <Typography variant="caption">{DISCLAIMER}</Typography>
  </Box>
);

export default Disclaimer;
