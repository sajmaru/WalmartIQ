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
  height: '100vh',
  overflowX: 'hidden',
  overflowY: 'auto', // Allow vertical scrolling if needed
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: theme.zIndex.appBar,
  boxShadow: theme.shadows[2], // Add consistent shadow
}));

const NavbarItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  textDecoration: 'none',
  justifyContent: 'flex-start',
  alignItems: 'center',
  transition: theme.transitions.create('color'),
  cursor: 'pointer',
  padding: '8px 4px', // More precise padding
  margin: '2px 0', // Small vertical margin
  minHeight: 56, // Consistent height
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 8,
  },
}));

const ItemIcon = styled(motion.create(Box))({
  width: NAVBAR_WIDTH,
  height: 56, // Reduced height for better proportion
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const ItemText = styled(Typography)({
  display: 'flex',
  flexShrink: 0,
  width: EXPANDED_NAVBAR_WIDTH - NAVBAR_WIDTH,
  alignItems: 'center',
  fontSize: '1.15em',
  paddingLeft: 12,
  paddingRight: 12,
  whiteSpace: 'nowrap', // Prevent text wrapping
});

const LargeItemText = styled(ItemText)({
  fontSize: '2.5em',
  fontWeight: 'bold',
});

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
            width: 0, // Completely hide when on welcome page
            overflow: 'hidden',
          },
          normal: {
            opacity: 1,
            width: NAVBAR_WIDTH,
            overflow: 'hidden',
          },
          expanded: {
            width: EXPANDED_NAVBAR_WIDTH,
            overflow: 'visible',
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
          focused: { color: theme.palette.primary.main },
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
              delay: i * 0.1, // Reduced delay for faster loading
            },
          }),
          hidden: { opacity: 0, translateY: 24 },
        },
      },
    }),
    [theme, location.pathname],
  );

  // Don't render navbar on welcome page
  if (location.pathname === '/welcome') {
    return null;
  }

  return (
    <NavbarContainer {...navbarMotion}>
      <ListItem sx={{ 
        paddingTop: 3, 
        paddingBottom: 3,
        paddingX: 1,
        display: 'flex',
        alignItems: 'center',
        minHeight: 72,
      }}>
        <ItemIcon {...iconMotion} sx={{ 
          width: NAVBAR_WIDTH - 8, 
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Suspense fallback={<div style={{ width: 32, height: 32 }} />}>
            <Logo style={{ 
              fontSize: 32, 
              color: theme.palette.primary.main,
              display: 'block',
            }} />
          </Suspense>
        </ItemIcon>
        <LargeItemText variant="h6" color="primary">
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
            sx={{ 
              textDecoration: 'none',
              marginX: 0.5,
              marginY: 0.25,
              borderRadius: 1,
            }}
          >
            <ItemIcon 
              custom={i + 1} 
              {...iconMotion}
              sx={{
                width: NAVBAR_WIDTH - 8,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <page.navbarIcon style={{ 
                fontSize: 24, 
                display: 'block',
              }} />
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

Navbar.displayName = 'Navbar';

export default Navbar;