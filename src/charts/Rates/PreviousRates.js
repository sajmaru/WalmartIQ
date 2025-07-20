import { Box, MenuItem } from '@mui/material';
import useSWR from 'swr';

import Header from '../../components/Header';
import Select from '../../components/MinimalSelect';
import SuspenseProgress from '../../components/SuspenseProgress';
import { API_HOST_URL } from '../../constants';
import useInput from '../../hooks/useInput';
import RatesHistory from './RatesHistory';

const PreviousRates = () => {
  const { data: values } = useSWR(`${API_HOST_URL}api/rates/getCodes`);
  
  // Fix: Use consistent indexing - both should use [0][1] for value
  const center = useInput(values?.centers?.[0]?.[1] || 'mumbai'); 
  const commodity = useInput(values?.commodities?.[0]?.[1] || 'wheat'); // Fix: Use [1] for value

  return (
    <Box paddingTop={3}>
      <Header
        title="Historic Pricing"
        actions={
          <>
            <Select dense id="center-select" {...center.bind}>
              {values?.centers?.map(([name, value], index) => (
                <MenuItem key={`center-${value}-${index}`} value={value}>
                  {name.charAt(0) + name.slice(1).toLowerCase()}
                </MenuItem>
              )) || []}
            </Select>
            <Select dense id="commodity-select" {...commodity.bind}>
              {values?.commodities?.map(([name, value], index) => (
                <MenuItem key={`commodity-${value}-${index}`} value={value}>
                  {name}
                </MenuItem>
              )) || []}
            </Select>
          </>
        }
      />
      <SuspenseProgress>
        <RatesHistory
          center={center.value}
          commodity={commodity.value}
        />
      </SuspenseProgress>
    </Box>
  );
};

export default PreviousRates;