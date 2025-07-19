import React, { useEffect } from 'react';
import { MenuItem, Grid, Box } from '@material-ui/core';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import Select from '../components/MinimalSelect';
import Header from '../components/Header';
import SuspenseProgress from '../components/SuspenseProgress';
import WarehouseMap from '../charts/Warehouse/WarehouseMap';
import WarehouseSummary from '../charts/Warehouse/WarehouseSummary';
import NoData from '../components/NoData';
import useInput from '../hooks/useInput';
import useRouting from '../routes/useRouting';

import {
  UNASSIGNED_STATE_CODE,
  INDIA_STATE_CODE,
  STATE_NAMES_ARRAY,
  API_HOST_URL,
} from '../constants';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== INDIA_STATE_CODE,
);

const WarehouseDashboard = () => {
  const { goTo, stateCode = INDIA_STATE_CODE } = useRouting();

  const state = useInput(stateCode);

  useEffect(() => {
    goTo(
      {
        stateCode: state.value,
      },
      '/warehouse',
    );
  }, [state.value, goTo]);

  return (
    <>
      <AnimatedEnter>
        <Header
          large
          title="Warehouse"
          actions={
            <>
              <Select {...state.bind}>
                <MenuItem value={INDIA_STATE_CODE}>All States</MenuItem>
                {dropdownStates.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </>
          }
        />
        <SuspenseProgress>
          <WarehouseDashboardContent {...{ stateCode }} />
        </SuspenseProgress>
      </AnimatedEnter>
    </>
  );
};

const WarehouseDashboardContent = ({ stateCode }) => {
  const {
    data: { data: dataAvailable },
  } = useSWR(`${API_HOST_URL}api/storage/checkData?stateCode=${stateCode}`);

  if (!dataAvailable) return <NoData />;

  return (
    <Box padding={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <WarehouseMap />
        </Grid>
        <Grid item xs={12} lg={7}>
          <WarehouseSummary />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseDashboard;
