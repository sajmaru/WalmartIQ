import React from 'react';
import { MenuItem, Box } from '@material-ui/core';
import useSWR from 'swr';

import RatesHistory from './RatesHistory';
import Header from '../../components/Header';
import Select from '../../components/MinimalSelect';
import SuspenseProgress from '../../components/SuspenseProgress';
import useInput from '../../hooks/useInput';
import { API_HOST_URL } from '../../constants';

const PreviousRates = () => {
  const { data: values } = useSWR(`${API_HOST_URL}api/rates/getCodes`);
  const center = useInput(values.centers[0][0]);
  const commodity = useInput(values.commodities[0][1]);

  return (
    <Box paddingTop={3}>
      <Header
        title="Historic Pricing"
        actions={
          <>
            <Select dense {...center.bind}>
              {values.centers.map(([name, value]) => (
                <MenuItem value={value}>
                  {name.charAt(0) + name.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
            <Select dense {...commodity.bind}>
              {values.commodities.map(([name, value]) => (
                <MenuItem value={value}>{name}</MenuItem>
              ))}
            </Select>
          </>
        }
      />
      <SuspenseProgress>
        <RatesHistory
          {...{ center: center.value, commodity: commodity.value }}
        />
      </SuspenseProgress>
    </Box>
  );
};

export default PreviousRates;
