import React from 'react';

import Header from '../../components/Header';
import SuspenseProgress from '../../components/SuspenseProgress';
import RateInsights from './RatesInsights';

const PredictedRates = () => {
  return (
    <>
      <Header title="Predicting Pricing" />
      <SuspenseProgress>
        <RateInsights key="predicted-rates" />
      </SuspenseProgress>
    </>
  );
};

export default PredictedRates;
