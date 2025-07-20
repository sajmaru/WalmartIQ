import React, { useCallback } from 'react';
import { Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledSelect = styled(Select)(({ theme, dense = false }) => ({
  background: theme.palette.background.paper,
  borderStyle: 'none',
  borderWidth: 0,
  borderRadius: 6,
  boxShadow: theme.shadows[0],
  fontSize: dense ? '0.8125rem' : '1rem',
  minWidth: dense ? 160 : 200,
  '&:focus': {
    borderRadius: 6,
    background: theme.palette.background.paper,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-select': {
    paddingLeft: dense ? 8 : 12,
    paddingRight: dense ? 36 : 48,
    paddingTop: dense ? 6 : 12,
    paddingBottom: dense ? 6 : 12,
  },
}));

const MinimalSelect = ({ 
  dense = false, 
  children, 
  value, 
  onChange, 
  defaultValue,
  ...props 
}) => {
  const IconComponent = useCallback(
    (iconProps) => (
      <ExpandMoreIcon
        {...iconProps}
        sx={{
          right: dense ? 4 : 12,
          position: 'absolute',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    ),
    [dense],
  );

  // Ensure we always have a valid value
  const safeValue = value ?? defaultValue ?? '';
  
  console.log('🎛️ MinimalSelect render:', {
    id: props.id,
    value,
    safeValue,
    hasOnChange: !!onChange
  });

  return (
    <StyledSelect
      variant="outlined"
      IconComponent={IconComponent}
      value={safeValue}
      onChange={onChange}
      displayEmpty
      {...props}
    >
      {children}
    </StyledSelect>
  );
};

export default MinimalSelect;