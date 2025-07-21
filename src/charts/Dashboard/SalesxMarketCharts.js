// src/charts/Dashboard/SalesxMarketCharts.js
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import useSWR from 'swr';

import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';
import SbuSalesChart from './SbuSalesChart';

import { API_HOST_URL, USA_STATE_CODE } from '../../constants';
import MarketChart from './MarketChart';

const marketConstants = {
  marketIndex: 'Market Index',
  consumerSentiment: 'Consumer Sentiment',
  competitorIndex: 'Competitor Index',
  economicIndex: 'Economic Index',
};

const SalesxMarketCharts = ({ on, marketParam }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    stateCode = USA_STATE_CODE,
    sbuCode,
    year = LATEST_YEAR,
  } = useRouting();

  const { data } = useSWR(
    `${API_HOST_URL}api/data/getSalesVsMarket?year=${year}&stateCode=${stateCode}&n=8&on=${on}&sbuCode=${sbuCode}`,
  );

  const marketData = useMemo(() => {
    if (!marketParam || data.length === 0) return [];

    return [
      {
        id: marketConstants[marketParam],
        data: data[0][marketParam].map(({ year: yr, value }) => ({
          x: yr,
          y: value,
        })),
      },
    ];
  }, [marketParam, data]);

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} lg={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6">Sales Performance</Typography>
            {data.length > 0 ? (
              <SbuSalesChart
                values={data[0].values}
                sbuCode={sbuCode}
              />
            ) : (
              <Typography variant="caption">*data yet to be loaded</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card variant="outlined" style={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6">Market Factors</Typography>
            {data.length > 0 ? (
              <MarketChart values={marketData} {...{ marketParam }} />
            ) : (
              <Typography variant="caption">*data yet to be loaded</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SalesxMarketCharts;