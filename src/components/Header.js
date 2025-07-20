import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

const HeaderContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'large', // Prevent 'large' from being forwarded to DOM
})(({ large, theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: large ? 24 : 12,
  paddingRight: large ? 20 : 8,
  paddingTop: large ? 20 : 8,
  paddingBottom: large ? 20 : 8,
}));

const Actions = styled(Box)({
  flexDirection: 'row',
  '& > *:not(:first-of-type)': {
    marginLeft: 16,
  },
});

const Header = ({ title, large, actions }) => (
  <HeaderContainer large={large}>
    <Typography variant={large ? 'h4' : 'h5'}>{title}</Typography>
    {actions && <Actions>{actions}</Actions>}
  </HeaderContainer>
);

export default Header;