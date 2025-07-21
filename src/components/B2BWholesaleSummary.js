

// src/components/B2BWholesaleSummary.js
import React from 'react';
import { Box, ButtonGroup, Button, MenuItem } from '@mui/material';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import B2BWholesaleChart from '../charts/Dashboard/B2BWholesaleChart';

import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import useInput from '../hooks/useInput';

const B2BWholesaleSummary = () => {
  const by = useButtonGroupSelect('value');
  const year = useInput('2023');

  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      flex={1}
      display="flex"
      flexDirection="column">
      <Header
        title="Sales Channels"
        actions={
          <>
            <Select id="year-select" dense {...year.bind}>
              {['2023', '2022', '2021'].map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
             <ButtonGroup disableElevation size="small">
              {Object.entries({
                value: 'By Value',
                volume: 'By Volume',
              }).map(([value, label]) => (
                <Button
                  key={`channel-${value}`}
                  variant="contained"
                  color={by.value === value ? 'primary' : 'default'}
                  {...by.bind(value)}>
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </>
        }
      />
      <SuspenseProgress>
        <B2BWholesaleChart by={by.value} year={year.value} />
      </SuspenseProgress>
    </Box>
  );
};

export default B2BWholesaleSummary;
