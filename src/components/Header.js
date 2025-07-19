import React from 'react';
import { styled } from '@material-ui/styles';
import { Typography, Box } from '@material-ui/core';

const Header = ({ title, large, actions }) => (
  <HeaderContainer large={large}>
    <Typography variant={large ? 'h4' : 'h5'}>{title}</Typography>
    {actions && <Actions>{actions}</Actions>}
  </HeaderContainer>
);

const HeaderContainer = styled('div')(({ large }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: large ? 24 : 12,
  paddingRight: large ? 20 : 8,
  paddingTop: large ? 20 : 8,
  paddingBottom: large ? 20 : 8,
}));

const Actions = styled(Box)({
  flexDirection: 'row',
  '& > *:not(:first-child)': {
    marginLeft: 16,
  },
});

export default Header;
