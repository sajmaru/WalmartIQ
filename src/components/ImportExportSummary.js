import React from 'react';
import { Box, ButtonGroup, Button, MenuItem } from '@material-ui/core';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import ImportExportChart from '../charts/Dashboard/ImportExportChart';

import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import useInput from '../hooks/useInput';

const ImportExportSummary = () => {
  const by = useButtonGroupSelect('quantity');
  const year = useInput('2016');

  return (
    <Box
      paddingLeft={4}
      paddingRight={4}
      flex={1}
      display="flex"
      flexDirection="column">
      <Header
        title="Trade"
        actions={
          <>
            <Select dense {...year.bind}>
              {['2016-17', '2017-18', '2018-19'].map((name) => (
                <MenuItem value={name.split('-')[0]}>{name}</MenuItem>
              ))}
            </Select>
            <ButtonGroup disableElevation size="small">
              {Object.entries({
                quantity: 'By Quantity',
                value: 'By Value',
              }).map(([value, label]) => (
                <Button
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
        <ImportExportChart by={by.value} year={year.value} />
      </SuspenseProgress>
    </Box>
  );
};

export default ImportExportSummary;
