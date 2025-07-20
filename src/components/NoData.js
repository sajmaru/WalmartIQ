import React, { memo } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { ResponsiveGeoMap } from './GeoMap';
import AnimatedEnter from './AnimatedEnter';
import useMap from '../hooks/useMap';
import useRouting from '../routes/useRouting';
import { INDIA_STATE_CODE } from '../constants';

const NoData = memo(() => {
  const { stateCode = INDIA_STATE_CODE } = useRouting();
  const { data: features } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);

  return (
    <AnimatedEnter>
      <Box
        style={{
          width: '50vw',
          height: '90vh',
          margin: '0 auto',
          padding: 18,
          position: 'relative',
        }}>
        <ResponsiveGeoMap
          fitProjection={true}
          projectionType="mercator" // Add explicit projection type
          borderWidth={2}
          borderColor="#404040"
          fillColor="#dddddd"
          features={features}
        />
        <Box
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Card>
            <Box padding={4}>
              <Typography variant="h5">
                <span role="img" aria-label="construction sign">
                  🚧
                </span>{' '}
                Data to be added soon!
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>
    </AnimatedEnter>
  );
});
export default NoData;

