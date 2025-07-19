import React, { useCallback } from 'react';
import { Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useMinimalSelectStyles = makeStyles((theme) => ({
  Select: ({ dense = false }) => ({
    background: theme.palette.background.paper,
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: 6,
    boxShadow: theme.shadows[0],
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
    },
  }),
  ExpandIcon: ({ dense = false }) => ({
    right: dense ? 4 : 12,
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
  }),
}));

const MinimalSelect = ({ dense, classes = {}, ...props }) => {
  const styles = useMinimalSelectStyles({ dense });

  const IconComponent = useCallback(
    ({ className, ...iconProps }) => (
      <ExpandMoreIcon
        className={[styles.ExpandIcon, className]}
        {...iconProps}
      />
    ),
    [styles.ExpandIcon],
  );

  return (
    <Select
      disableUnderline
      classes={{ ...classes, root: [styles.Select, classes.root].join(' ') }}
      {...{ IconComponent }}
      {...props}
    />
  );
};

export default MinimalSelect;
