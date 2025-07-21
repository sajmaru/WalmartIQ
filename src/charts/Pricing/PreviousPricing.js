// src/charts/Pricing/PreviousPricing.js
import { Box, MenuItem } from '@mui/material';
import useSWR from 'swr';

import Header from '../../components/Header';
import Select from '../../components/MinimalSelect';
import SuspenseProgress from '../../components/SuspenseProgress';
import { API_HOST_URL } from '../../constants';
import useInput from '../../hooks/useInput';
import PricingHistory from './PricingHistory';

const PreviousPricing = () => {
  const { data: values } = useSWR(`${API_HOST_URL}api/pricing/getCodes`);
  
  const channel = useInput(values?.channels?.[0]?.[1] || 'online'); 
  const sbu = useInput(values?.sbus?.[0]?.[1] || 'electronics');

  return (
    <Box paddingTop={3}>
      <Header
        title="Pricing History"
        actions={
          <>
            <Select dense id="channel-select" {...channel.bind}>
              {values?.channels?.map(([name, value], index) => (
                <MenuItem key={`channel-${value}-${index}`} value={value}>
                  {name}
                </MenuItem>
              )) || []}
            </Select>
            <Select dense id="sbu-select" {...sbu.bind}>
              {values?.sbus?.map(([name, value], index) => (
                <MenuItem key={`sbu-${value}-${index}`} value={value}>
                  {name}
                </MenuItem>
              )) || []}
            </Select>
          </>
        }
      />
      <SuspenseProgress>
        <PricingHistory
          channel={channel.value}
          sbu={sbu.value}
        />
      </SuspenseProgress>
    </Box>
  );
};

export default PreviousPricing;