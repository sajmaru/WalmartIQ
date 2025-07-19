import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Collapse,
  useTheme,
} from '@material-ui/core';
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
  const { data } = useSwr(
    `${API_HOST_URL}api/dashboard/cropSummary?year=${year}&stateCode=${stateCode}&n=${
      stateCode === INDIA_STATE_CODE ? 6 : 9
    }`,
  );
  const theme = useTheme();

  return (
    <AnimatedEnter>
      <Grid container spacing={3} alignItems="center" justify="center">
        {data.slice(0, 3).map(({ crop, series, year: years, insights }) => (
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Card
              variant="outlined"
              style={{ overflow: 'visible' }}
              onClick={() => goTo({ cropCode: crop, stateCode, year })}>
              <CardContent>
                <Box flex={1}>
                  <Typography variant="h6">{CROP_NAMES[crop]}</Typography>
                  <TopCropChart production={series} years={years} crop={crop} />
                </Box>
                <SummaryCards content={insights} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Collapse in={expanded}>
        <Grid container spacing={3} style={{ marginTop: theme.spacing(3) / 2 }}>
          {data.slice(3).map(({ crop, series, year: years, insights }) => (
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Card
                variant="outlined"
                onClick={() => goTo({ cropCode: crop, stateCode, year })}>
                <CardContent>
                  <Box flex={1}>
                    <Typography variant="h6">{CROP_NAMES[crop]}</Typography>
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
