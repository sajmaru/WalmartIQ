
// src/components/SalesxMarket.js
import React from 'react';
import { Button, Box, ButtonGroup, MenuItem } from '@mui/material';

import Header from './Header';
import SuspenseProgress from './SuspenseProgress';
import Select from './MinimalSelect';
import SalesxMarketCharts from '../charts/Dashboard/SalesxMarketCharts';
import useButtonGroupSelect from '../hooks/useButtonGroupSelect';
import useInput from '../hooks/useInput';

const marketFactors = {
  marketIndex: 'Market Index',
  consumerSentiment: 'Consumer Sentiment',
  competitorIndex: 'Competitor Index',
  economicIndex: 'Economic Index',
};

const SalesxMarket = () => {
  const on = useButtonGroupSelect('gmv');
  const marketParam = useInput('marketIndex');

  return (
    <Box padding={4} flex={1}>
      <Header
        title="Sales vs Market Analysis"
        actions={
          <>
            <ButtonGroup disableElevation size="small">
              {Object.entries({ gmv: 'GMV', units: 'Units' }).map(
                ([value, label]) => (
                  <Button
                    key={`sales-metric-${value}`}
                    variant="contained"
                    color={on.value === value ? 'primary' : 'default'}
                    {...on.bind(value)}>
                    {label}
                  </Button>
                ),
              )}
            </ButtonGroup>
            <Select id="market-param-select" {...marketParam.bind} dense>
              {Object.entries(marketFactors).map(([value, name]) => (
                <MenuItem value={value} key={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </>
        }
      />
      <Box>
        <SuspenseProgress>
          <SalesxMarketCharts
            on={on.value}
            marketParam={marketParam.value}
          />
        </SuspenseProgress>
      </Box>
    </Box>
  );
};

export default SalesxMarket;