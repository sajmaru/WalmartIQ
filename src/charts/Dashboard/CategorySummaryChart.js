import { Box, Collapse, Grid } from '@mui/material';
import useSWR from 'swr';

import CategoryCard from '../../components/CategoryCard';
import useRouting from '../../routes/useRouting';

import { USA_STATE_CODE } from '../../constants';

const CategorySummaryChart = ({ expanded }) => {
  const { stateCode = USA_STATE_CODE } = useRouting();
  const { data = [] } = useSWR(
    `https://usapa-backend.herokuapp.com/api/dashboard/cropCategory?stateCode=${stateCode}`,
    {
      fallbackData: [],
    },
  );

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      justifyContent="space-evenly"
      style={{ overflow: 'visible' }}>
      <Grid container spacing={3}>
        {data.slice(0, 4).map(({ categoryName, production, consumption }) => (
          <Grid item xs={12} md={6} lg={3} key={`category-${categoryName}`}>
            <CategoryCard
              categoryName={categoryName}
              production={production}
              consumption={consumption}
            />
          </Grid>
        ))}
      </Grid>
      <Collapse in={expanded}>
        <Grid
          container
          spacing={3}
          style={{ marginTop: 12, overflow: 'visible' }}>
          {data.slice(4).map(({ categoryName, production, consumption }) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              key={`category-expanded-${categoryName}`}>
              <CategoryCard
                categoryName={categoryName}
                production={production}
                consumption={consumption}
              />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );
};

export default CategorySummaryChart;
