import React from 'react';
import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/styles/useTheme';

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
