import React, { lazy, Suspense, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, ListItem } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import { motion } from 'framer-motion';
import { pages } from '../routes/Router';

const Logo = lazy(() => import('../assets/LitCrops'));

export const NAVBAR_WIDTH = 72;
export const EXPANDED_NAVBAR_WIDTH = 288;

const useNavbarStyles = makeStyles((theme) => ({
  Container: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflowX: 'hidden',
    position: 'fixed',
    zIndex: theme.zIndex.appBar,
  },
  Item: {
    display: 'flex',
    flexDirection: 'row',
    textDecoration: 'none',
    justifyContent: 'unset',
    transition: theme.transitions.create('color'),
  },
  ItemIcon: {
    width: NAVBAR_WIDTH,
    height: 64,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ItemText: {
    display: 'flex',
    flexShrink: 0,
    width: EXPANDED_NAVBAR_WIDTH - NAVBAR_WIDTH,
    alignItems: 'center',
    fontSize: '1.15em',
    paddingLeft: 12,
    paddingRight: 12,
  },
  LargeItemText: {
    fontSize: '2.5em',
  },
}));

const MotionBox = motion.custom(Box);
const MotionListItem = motion.custom(ListItem);

const Navbar = memo(() => {
  const styles = useNavbarStyles();
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
    <MotionBox {...navbarMotion} classes={{ root: styles.Container }}>
      <ListItem disableGutters>
        <MotionBox {...iconMotion} classes={{ root: styles.ItemIcon }}>
          <Suspense fallback={<div />}>
            <Logo style={{ fontSize: NAVBAR_WIDTH - 32 }} />
          </Suspense>
        </MotionBox>
        <Typography
          variant="button"
          classes={{ root: [styles.ItemText, styles.LargeItemText].join(' ') }}>
          USAPA
        </Typography>
      </ListItem>
      {pages.map((page, i) =>
        page.showInNavbar === true ? (
          <MotionListItem
            button
            dense
            disableGutters
            {...itemMotion}
            animate={location.pathname === page.pageLink ? 'focused' : 'normal'}
            component={Link}
            classes={{ root: styles.Item }}
            to={page.pageLink}
            key={page.pageLink}>
            <MotionBox
              custom={i + 1}
              {...iconMotion}
              classes={{ root: styles.ItemIcon }}>
              <page.navbarIcon style={{ fontSize: 28 }} />
            </MotionBox>
            <Typography variant="button" classes={{ root: styles.ItemText }}>
              {page.displayName}
            </Typography>
          </MotionListItem>
        ) : null,
      )}
    </MotionBox>
  );
});

export default Navbar;
