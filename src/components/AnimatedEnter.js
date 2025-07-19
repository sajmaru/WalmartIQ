import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { motion } from 'framer-motion';

const MotionBox = motion.custom(Box);

const AnimatedEnter = ({ staggerPosition = 0, loaded = true, ...props }) => {
  const theme = useTheme();

  const containerMotion = useMemo(
    () => ({
      initial: 'initial',
      animate: loaded ? 'in' : 'initial',
      exit: 'out',
      variants: {
        initial: {
          opacity: 0,
          translateY: 48,
        },
        in: {
          opacity: 1,
          translateY: 0,
        },
        out: {
          opacity: 0,
        },
      },
      transition: {
        duration: theme.transitions.duration.complex / 1000,
        easing: theme.transitions.easing.easeInOut,
        delay: staggerPosition * 0.5,
      },
    }),
    [staggerPosition, theme, loaded],
  );

  return <MotionBox {...containerMotion} {...props} />;
};

export default AnimatedEnter;
