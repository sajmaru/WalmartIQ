// src/components/NoData.js - Simplified and bulletproof
import React, { memo } from 'react';
import { Box, Card, Typography, CircularProgress } from '@mui/material';
import { ResponsiveGeoMap } from './GeoMap';
import AnimatedEnter from './AnimatedEnter';
import useMap from '../hooks/useMap';
import useRouting from '../routes/useRouting';
import { INDIA_STATE_CODE } from '../constants';

const NoData = memo(() => {
  const { stateCode = INDIA_STATE_CODE } = useRouting();
  const { data, error, isLoading } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);
  
  // Ensure data is always an array
  const features = Array.isArray(data) ? data : [];
  
  console.log('NoData render:', { 
    stateCode, 
    featuresLength: features.length, 
    error: error?.message, 
    isLoading 
  });

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
        
        {/* Loading */}
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Card>
              <Box padding={4} display="flex" alignItems="center" gap={2}>
                <CircularProgress size={24} />
                <Typography>Loading map...</Typography>
              </Box>
            </Card>
          </Box>
        )}

        {/* Error */}
        {error && !isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Card>
              <Box padding={4}>
                <Typography variant="h6" color="error">
                  ⚠️ Map Error
                </Typography>
                <Typography variant="body2">{error.message}</Typography>
              </Box>
            </Card>
          </Box>
        )}

        {/* Map with features */}
        {features.length > 0 && !isLoading && !error && (
          <>
            <ResponsiveGeoMap
              features={features}
              fitProjection={true}
              projectionType="mercator"
              borderWidth={2}
              borderColor="#404040"
              fillColor="#dddddd"
              isInteractive={true}
            />
            
            {/* Overlay */}
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}>
              <Card style={{ pointerEvents: 'auto' }}>
                <Box padding={4} textAlign="center">
                  <Typography variant="h5">
                    🚧 Data to be added soon!
                  </Typography>
                  <Typography variant="caption">
                    {features.length} map regions loaded
                  </Typography>
                </Box>
              </Card>
            </Box>
          </>
        )}

        {/* No features */}
        {features.length === 0 && !isLoading && !error && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Card>
              <Box padding={4} textAlign="center">
                <Typography variant="h6">
                  🗺️ No map data
                </Typography>
                <Typography variant="body2">
                  State: {stateCode}
                </Typography>
              </Box>
            </Card>
          </Box>
        )}
      </Box>
    </AnimatedEnter>
  );
});

export default NoData;