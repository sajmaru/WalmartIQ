
// src/charts/Dashboard/TopSbuCharts.js
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from '@mui/material';
import useSwr from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import SummaryCards from '../../components/SummaryCards';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';
import TopSbuChart from './TopSbuChart';

import { API_HOST_URL, SBU_NAMES, USA_STATE_CODE } from '../../constants';

const TopSbuSummary = ({ expanded }) => {
  const { LATEST_YEAR } = useConstants();
  const { goTo, stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();
  const { data = [] } = useSwr(
    `${API_HOST_URL}api/dashboard/sbuSummary?year=${year}&stateCode=${stateCode}&n=${
      stateCode === USA_STATE_CODE ? 6 : 9
    }`,
    {
      fallbackData: [],
    },
  );

  return (
    <AnimatedEnter>
      <Grid container spacing={3} alignItems="center" justify="center">
        {data
          .slice(0, 3)
          .map(({ sbu, series, year: years, insights }, index) => (
            <Grid
              item
              lg={4}
              md={12}
              sm={12}
              xs={12}
              key={`top-sbu-${sbu}-${index}`}>
              <Card
                variant="outlined"
                style={{ overflow: 'visible', cursor: 'pointer' }}
                onClick={() => goTo({ sbuCode: sbu, stateCode, year })}>
                <CardContent>
                  <Box flex={1}>
                    <Typography variant="h6">
                      {SBU_NAMES[sbu] || sbu}
                    </Typography>
                    <TopSbuChart
                      sales={series}
                      years={years}
                      sbu={sbu}
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
            .map(({ sbu, series, year: years, insights }, index) => (
              <Grid
                item
                lg={4}
                md={12}
                sm={12}
                xs={12}
                key={`more-sbu-${sbu}-${index}`}>
                <Card
                  variant="outlined"
                  style={{ cursor: 'pointer' }}
                  onClick={() => goTo({ sbuCode: sbu, stateCode, year })}>
                  <CardContent>
                    <Box flex={1}>
                      <Typography variant="h6">
                        {SBU_NAMES[sbu] || sbu}
                      </Typography>
                      <TopSbuChart
                        sales={series}
                        years={years}
                        sbu={sbu}
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

export default TopSbuSummary;
