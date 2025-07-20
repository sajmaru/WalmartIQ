import { Box, Grid, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import useSWR from 'swr';
import WarehouseMap from '../charts/Warehouse/WarehouseMap';
import WarehouseSummary from '../charts/Warehouse/WarehouseSummary';
import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import Select from '../components/MinimalSelect';
import NoData from '../components/NoData';
import SuspenseProgress from '../components/SuspenseProgress';
import useInput from '../hooks/useInput';
import useRouting from '../routes/useRouting';

import {
  API_HOST_URL,
  STATE_NAMES_ARRAY,
  UNASSIGNED_STATE_CODE,
  USA_STATE_CODE,
} from '../constants';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== USA_STATE_CODE,
);

const WarehouseDashboard = () => {
  const { goTo, stateCode = USA_STATE_CODE } = useRouting();

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
              <Select id="state-select" {...state.bind}>
                <MenuItem key={USA_STATE_CODE} value={USA_STATE_CODE}>
                  All States
                </MenuItem>
                {dropdownStates.map(({ name, code }) => (
                  <MenuItem key={code} value={code}>
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

