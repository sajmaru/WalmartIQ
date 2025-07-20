import { Box } from '@mui/material';

import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import SuspenseLoader from '../components/SuspenseProgress';

import PredictedRates from '../charts/Rates/PredictedRates';
import PreviousRates from '../charts/Rates/PreviousRates';

const RatesDashboard = () => {
  return (
    <AnimatedEnter>
      <Header large title="Crop Rates" />
      <Box padding={3}>
        <SuspenseLoader>
          <PredictedRates />
          <PreviousRates />
        </SuspenseLoader>
      </Box>
    </AnimatedEnter>
  );
};

export default RatesDashboard;
