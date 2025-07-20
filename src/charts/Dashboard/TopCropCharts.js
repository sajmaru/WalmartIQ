import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import useSwr from 'swr';
import TopCropChart from './TopCropChart';
import AnimatedEnter from '../../components/AnimatedEnter';
import SummaryCards from '../../components/SummaryCards';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';

import { CROP_NAMES, INDIA_STATE_CODE, API_HOST_URL } from '../../constants';

const TopCropSummary = ({ expanded }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    year = LATEST_YEAR,
  } = useRouting();
  const { data = [] } = useSwr(
    `${API_HOST_URL}api/dashboard/cropSummary?year=${year}&stateCode=${stateCode}&n=${
      stateCode === INDIA_STATE_CODE ? 6 : 9
    }`,
    {
      fallbackData: [],
      onError: (err) => console.log('🎭 Using fallback crop data due to:', err.message)
    }
  );

  return (
    <AnimatedEnter>
      <Grid container spacing={3} alignItems="center" justify="center">
        {data
          .slice(0, 3)
          .map(({ crop, series, year: years, insights }, index) => (
            <Grid
              item
              lg={4}
              md={12}
              sm={12}
              xs={12}
              key={`top-crop-${crop}-${index}`}>
              <Card
                variant="outlined"
                style={{ overflow: 'visible', cursor: 'pointer' }}
                onClick={() => goTo({ cropCode: crop, stateCode, year })}>
                <CardContent>
                  <Box flex={1}>
                    <Typography variant="h6">{CROP_NAMES[crop] || crop}</Typography>
                    <TopCropChart
                      production={series}
                      years={years}
                      crop={crop}
                    />
                  </Box>
                  <SummaryCards content={insights} />
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Collapse in={expanded}>
        <Grid container spacing={3} style={{ marginTop: 12 }}>
          {data
            .slice(3)
            .map(({ crop, series, year: years, insights }, index) => (
              <Grid
                item
                lg={4}
                md={12}
                sm={12}
                xs={12}
                key={`more-crop-${crop}-${index}`}>
                <Card
                  variant="outlined"
                  style={{ cursor: 'pointer' }}
                  onClick={() => goTo({ cropCode: crop, stateCode, year })}>
                  <CardContent>
                    <Box flex={1}>
                      <Typography variant="h6">{CROP_NAMES[crop] || crop}</Typography>
                      <TopCropChart
                        production={series}
                        years={years}
                        crop={crop}
                      />
                    </Box>
                    <SummaryCards content={insights} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Collapse>
    </AnimatedEnter>
  );
};

export default TopCropSummary;