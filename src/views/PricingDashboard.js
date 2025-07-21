import { Box } from '@mui/material';

import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import SuspenseLoader from '../components/SuspenseProgress';

import PredictedPricing from '../charts/Pricing/PredictedPricing';
import PreviousPricing from '../charts/Pricing/PreviousPricing';

const PricingDashboard = () => {
  return (
    <AnimatedEnter>
      <Header large title="Pricing Analytics" />
      <Box padding={3}>
        <SuspenseLoader>
          <PredictedPricing />
          <PreviousPricing />
        </SuspenseLoader>
      </Box>
    </AnimatedEnter>
  );
};

export default PricingDashboard;