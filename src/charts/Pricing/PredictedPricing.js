// src/charts/Pricing/PredictedPricing.js
import React from 'react';

import Header from '../../components/Header';
import SuspenseProgress from '../../components/SuspenseProgress';
import PricingInsights from './PricingInsights';

const PredictedPricing = () => {
  return (
    <>
      <Header title="Pricing Forecasts" />
      <SuspenseProgress>
        <PricingInsights key="predicted-pricing" />
      </SuspenseProgress>
    </>
  );
};

export default PredictedPricing;