import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'dense',
})(({ theme, dense = false }) => ({
  '& .MuiInputBase-root': {
    background: theme.palette.background.paper,
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: 6,
    boxShadow: theme.shadows[0],
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontSize: dense ? '0.8125rem' : '1rem',
    minWidth: dense ? 160 : 200,
    paddingLeft: dense ? 8 : 12,
    paddingRight: dense ? 36 : 48,
    paddingTop: dense ? 6 : 12,
    paddingBottom: dense ? 6 : 12,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-root.Mui-focused': {
    borderRadius: 6,
    background: theme.palette.background.paper,
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
  },
  '& .MuiInputLabel-root': {
    marginTop: dense ? theme.spacing(3) : 0,
  },
}));

const MinimalInput = ({ dense, ...props }) => {
  return (
    <StyledTextField
      variant="outlined"
      dense={dense}
      {...props}
    />
  );
};

export default MinimalInput;