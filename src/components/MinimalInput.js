import React, { useCallback } from 'react';
import { TextField, fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useMinimalInputStyles = makeStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  Input: ({ dense = false }) => ({
    background: theme.palette.background.paper,
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: 6,
    boxShadow: theme.shadows[0],
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    ...(dense
      ? {
          fontSize: '0.8125rem',
          minWidth: 160,
          paddingLeft: 8,
          paddingRight: 36,
          paddingTop: 6,
          paddingBottom: 6,
        }
      : {
          minWidth: 200,
          paddingLeft: 12,
          paddingRight: 48,
          paddingTop: 12,
          paddingBottom: 12,
        }),
    '&:focus': {
      borderRadius: 6,
      background: theme.palette.background.paper,
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  }),
}));

const MinimalInput = ({ dense, classes = {}, ...props }) => {
  const styles = useMinimalInputStyles({ dense });

  return (
    <TextField
      disableUnderline
      classes={{
        ...classes,
        root: [styles.root, styles.Input, classes.root].join(' '),
      }}
      variant="outlined"
      {...props}
    />
  );
};

export default MinimalInput;
