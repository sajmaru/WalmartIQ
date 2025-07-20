import React from 'react';
import Box from '@mui/material/Box';
import useTheme from '@mui/styles/useTheme';

const InsetCard = ({ style, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      style={{
        backgroundColor: theme.palette.action.hover,
        borderRadius: 8,
        ...style,
      }}
      {...props}
    />
  );
};

export default InsetCard;
