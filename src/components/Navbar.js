import React, { lazy, Suspense, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { pages } from '../routes/Router';

const Logo = lazy(() => import('../assets/LitCrops'));

export const NAVBAR_WIDTH = 72;
export const EXPANDED_NAVBAR_WIDTH = 288;

const NavbarContainer = styled(motion.create(Box))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  overflowX: 'hidden',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
}));

const NavbarItem = styled(ListItem, {
  shouldForwardProp: (prop) => !['button', 'dense', 'disableGutters'].includes(prop),
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  textDecoration: 'none',
  justifyContent: 'unset',
  transition: theme.transitions.create('color'),
}));

const ItemIcon = styled(motion.create(Box))({
  width: NAVBAR_WIDTH,
  height: 64,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ItemText = styled(Typography)({
  display: 'flex',
  flexShrink: 0,
  width: EXPANDED_NAVBAR_WIDTH - NAVBAR_WIDTH,
  alignItems: 'center',
  fontSize: '1.15em',
  paddingLeft: 12,
  paddingRight: 12,
});

const LargeItemText = styled(ItemText)({
  fontSize: '2.5em',
});

const MotionBox = motion.create(Box);
const MotionNavbarItem = motion.create(NavbarItem);

const Navbar = memo(() => {
  const theme = useTheme();
  const location = useLocation();

  const { navbarMotion, itemMotion, iconMotion } = useMemo(
    () => ({
      navbarMotion: {
        initial: 'hidden',
        animate: location.pathname === '/welcome' ? 'hidden' : 'normal',
        whileHover: 'expanded',
        variants: {
          hidden: {
            opacity: 0,
            width: NAVBAR_WIDTH,
          },
          normal: {
            opacity: 1,
            width: NAVBAR_WIDTH,
            boxShadow: theme.shadows[1],
          },
          expanded: {
            width: EXPANDED_NAVBAR_WIDTH,
            boxShadow: theme.shadows[2],
          },
        },
        transition: {
          duration: theme.transitions.duration.short / 1000,
          easing: theme.transitions.easing.sharp,
        },
      },
      itemMotion: {
        variants: {
          normal: { color: theme.palette.text.primary },
          focused: { color: theme.palette.primary.dark },
        },
        transition: {
          duration: theme.transitions.duration.shortest / 1000,
          easing: theme.transitions.easing.sharp,
        },
      },
      iconMotion: {
        initial: 'hidden',
        animate: 'visible',
        variants: {
          visible: (i = 0) => ({
            opacity: 1,
            translateY: 0,
            transition: {
              delay: i * 0.3,
            },
          }),
          hidden: { opacity: 0, translateY: 24 },
        },
      },
    }),
    [theme, location.pathname],
  );

  return (
    <NavbarContainer {...navbarMotion}>
      <ListItem>
        <ItemIcon {...iconMotion}>
          <Suspense fallback={<div />}>
            <Logo style={{ fontSize: NAVBAR_WIDTH - 32 }} />
          </Suspense>
        </ItemIcon>
        <LargeItemText variant="button">
          USAPA
        </LargeItemText>
      </ListItem>
      {pages.map((page, i) =>
        page.showInNavbar === true ? (
          <MotionNavbarItem
            key={page.pageLink}
            {...itemMotion}
            animate={location.pathname === page.pageLink ? 'focused' : 'normal'}
            component={Link}
            to={page.pageLink}
            sx={{ cursor: 'pointer' }} // Add cursor pointer instead of button prop
          >
            <ItemIcon
              custom={i + 1}
              {...iconMotion}
            >
              <page.navbarIcon style={{ fontSize: 28 }} />
            </ItemIcon>
            <ItemText variant="button">
              {page.displayName}
            </ItemText>
          </MotionNavbarItem>
        ) : null,
      )}
    </NavbarContainer>
  );
});

export default Navbar;