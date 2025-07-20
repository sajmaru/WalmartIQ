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
  
  // Fix: Use the VALUE (second element) not the LABEL (first element)
  const center = useInput(values.centers[0][1]); // Use "mumbai" not "Mumbai"
  const commodity = useInput(values.commodities[0][0]); // Use "Wheat" (this one is correct)

  return (
    <Box paddingTop={3}>
      <Header
        title="Historic Pricing"
        actions={
          <>
            <Select dense id="center-select" {...center.bind}>
              {values.centers.map(([name, value], index) => (
                <MenuItem key={`center-${value}-${index}`} value={value}>
                  {name.charAt(0) + name.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
            <Select dense id="commodity-select" {...commodity.bind}>
              {values.commodities.map(([name, value], index) => (
                <MenuItem key={`commodity-${value}-${index}`} value={value}>
                  {name}
                </MenuItem>
              ))}
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
