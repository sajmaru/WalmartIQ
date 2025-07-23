// src/charts/Dashboard/MapSummaryChart.js - Updated with Hurricane Ian integration
import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { Chip, TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import LottieHurricaneOverlay from '../../components/LottieHurricaneOverlay';
import {
  API_HOST_URL,
  SBU_COLORS,
  SALES_METRICS_NAMES,
  SALES_METRICS_UNITS,
  SBU_NAMES,
  STATE_CODES,
  STATE_NAMES,
  UNASSIGNED_SBU_CODE,
  USA_STATE_CODE,
  FIPS_TO_STATE_CODE,
  getStateCodeFromName,
} from '../../constants';
import { readableNumber } from '../../helpers';
import useConstants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

// Beautiful, soft color palette - not too dark
const SOFT_COLOR_PALETTE = [
  '#FF6B9D', // Soft Pink
  '#45B7D1', // Sky Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Soft Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Turquoise
  '#F7DC6F', // Light Gold
  '#BB8FCE', // Light Purple
  '#85C1E9', // Light Blue
  '#82E0AA', // Light Green
  '#F8C471', // Peach
  '#EC7063', // Coral
  '#85C1E9', // Light Cyan
  '#D7BDE2', // Lavender
  '#A9DFBF', // Sage Green
  '#F9E79F', // Cream Yellow
  '#F1948A', // Light Salmon
  '#AED6F1', // Powder Blue
  '#A3E4D7', // Aqua
  '#FAD7A0', // Soft Orange
  '#D5A6BD', // Dusty Rose
  '#7FB3D3', // Steel Blue
  '#90EE90', // Light Green
  '#FFB6C1', // Light Pink
  '#20B2AA', // Light Sea Green
  '#DEB887', // Burlywood
  '#F0E68C', // Khaki
  '#DA70D6', // Orchid
  '#87CEEB', // Sky Blue
  '#98FB98', // Pale Green
  '#F0F8FF', // Alice Blue
  '#FAFAD2', // Light Goldenrod
  '#FFE4E1', // Misty Rose
  '#E0FFFF', // Light Cyan
  '#F5DEB3', // Wheat
  '#FFF8DC', // Cornsilk
  '#FFFACD', // Lemon Chiffon
  '#E6E6FA', // Lavender
  '#FDF5E6', // Old Lace
  '#F0FFFF', // Azure
  '#F5F5DC', // Beige
  '#FAF0E6', // Linen
  '#FFFAF0', // Floral White
  '#F8F8FF', // Ghost White
  '#F0F8FF', // Alice Blue
  '#FAEBD7', // Antique White
  '#FFF5EE', // Seashell
  '#F5FFFA'  // Mint Cream
];

// Function to get consistent random color for each state
const getStateColor = (stateName) => {
  // Handle undefined, null, or empty state names
  if (!stateName || typeof stateName !== 'string' || stateName.length === 0) {
    console.warn('Invalid stateName provided to getStateColor:', stateName);
    return SOFT_COLOR_PALETTE[0]; // Return first color as fallback
  }
  
  // Create a simple hash from state name to ensure consistency
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    const char = stateName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index in palette
  const colorIndex = Math.abs(hash) % SOFT_COLOR_PALETTE.length;
  return SOFT_COLOR_PALETTE[colorIndex];
};

const MapSummaryChart = memo(
  ({ on = 'gmv', setMapHeight = () => {} }) => {
    const { LATEST_YEAR } = useConstants();
    const {
      goTo,
      stateCode = USA_STATE_CODE,
      year = LATEST_YEAR,
    } = useRouting();

    const { data: features } = useMap(stateCode, stateCode !== USA_STATE_CODE);
    const { data: values } = useSWR(
      `${API_HOST_URL}api/dashboard/mapSummary?year=${year}&stateCode=${stateCode}&on=${on}`,
      {
        fallbackData: [],
      },
    );

    const mapRef = useRef(null);
    const mapHeight = mapRef.current?.clientWidth || 700;
    
    // Hurricane simulation state
    const [showHurricane, setShowHurricane] = useState(false);
    const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 500 });

    useEffect(() => setMapHeight(mapHeight), [mapHeight, setMapHeight]);

    // Update map dimensions when container resizes
    useEffect(() => {
      const updateDimensions = () => {
        if (mapRef.current) {
          const { width, height } = mapRef.current.getBoundingClientRect();
          setMapDimensions({ width, height });
        }
      };

      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      if (mapRef.current) {
        resizeObserver.observe(mapRef.current);
      }
      
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Debug logging
    console.log('🗺️ MapSummaryChart Debug:', {
      valuesLength: values?.length,
      values: values,
      stateCode,
      year,
      on
    });

    // Determine if this is the US country map
    const isUSMap = stateCode === USA_STATE_CODE;

    const { mapProps, legend } = useMemo(() => {
      if (!values || values.length === 0) {
        return {
          mapProps: {
            fillColor: () => '#f0f0f0',
            borderWidth: () => 1,
            borderColor: () => '#ccc',
            onClick: () => {},
            tooltip: () => null,
          },
          legend: {},
        };
      }

      const [data, legend] = values.reduce(
        ([accData, accLegend], { location, topSBUs }) => {
          const id =
            stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
          const name =
            stateCode === USA_STATE_CODE
              ? STATE_NAMES[location]
              : location.split('-')[1];
          const topSBU = topSBUs[0]?.sbu;

          if (!topSBU) {
            return [accData, accLegend];
          }

          // Use random color based on state name instead of SBU color
          const stateColor = getStateColor(name || id);

          return [
            {
              ...accData,
              [id]: {
                name,
                locationColor: stateColor,
                topSBUs: topSBUs
                  .slice(0, 3)
                  .map(({ sbu: sbuCode, value }) => ({
                    sbuCode,
                    sbu: SBU_NAMES[sbuCode] || sbuCode,
                    sbuColor: SBU_COLORS[sbuCode] || '#dddddd',
                    value: on === 'gmv' 
                      ? `$${readableNumber(value / 1000000)}M`
                      : on === 'units'
                      ? `${readableNumber(value / 1000)}K`
                      : `$${readableNumber(value)}`,
                  })),
              },
            },
            {
              ...accLegend,
              // We don't need a legend for random colors, but keeping structure
            },
          ];
        },
        [{}, {}],
      );

      return {
        mapProps: {
          fillColor: (feature) => {
            const {
              properties: { st_nm: stateName, district: districtName },
            } = feature;
            const lookupKey =
              stateCode === USA_STATE_CODE
                ? stateName
                : `${stateName}-${districtName}`.toUpperCase();

            const fillColor =
              data[lookupKey]?.locationColor ||
              getStateColor(stateName || districtName || lookupKey || 'default');

            return fillColor;
          },
          borderWidth: () => 2,
          borderColor: () => '#666666',
          onClick: (feature) => {
            console.log('🗺️ Map feature clicked:', feature);

            const {
              properties: { st_nm: stateName, district: districtName },
            } = feature;

            if (stateCode === USA_STATE_CODE && stateName) {
              let targetStateCode = getStateCodeFromName(stateName);
              
              if (!targetStateCode && feature.id) {
                targetStateCode = FIPS_TO_STATE_CODE[feature.id];
              }

              console.log('🗺️ State lookup:', {
                originalName: stateName,
                targetStateCode,
                feature
              });

              if (targetStateCode) {
                console.log('🗺️ Navigating to state:', targetStateCode);
                goTo({
                  stateCode: targetStateCode,
                  year,
                });
              } else {
                console.warn('🗺️ State code not found for:', stateName, feature);
                console.log('🗺️ Available STATE_CODES:', Object.keys(STATE_CODES));
              }
            } else if (stateCode !== USA_STATE_CODE && districtName) {
              console.log('🗺️ District/county click not implemented yet:', districtName);
            }
          },
          tooltip: ({
            feature: {
              properties: { st_nm: stateName, district: districtName },
            },
          }) => {
            const id =
              stateCode === USA_STATE_CODE
                ? stateName
                : `${stateName}-${districtName}`.toUpperCase();
            
            const locationName = stateCode === USA_STATE_CODE ? stateName : districtName;
            
            return (
              <TableTooltip
                title={
                  <>
                    <b>{locationName}</b> - Top SBU Performance ({SALES_METRICS_UNITS[on]})
                  </>
                }
                rows={
                  data[id]
                    ? data[id].topSBUs.map(({ sbu, sbuColor, value }, index) => [
                        <Chip key={sbu} color={sbuColor} />,
                        `${index + 1}. ${sbu}`,
                        value,
                      ])
                    : [
                        ['🔍', 'Debug Info:', ''],
                        ['State ID:', id || 'undefined', ''],
                        ['State Name:', locationName || 'undefined', ''],
                        ['Data Keys:', Object.keys(data).join(', ') || 'none', ''],
                        ['', 'No sales data available', '']
                      ]
                }
              />
            );
          },
        },
        legend,
      };
    }, [values, stateCode, year, goTo, on]);

    return (
      <AnimatedEnter>
        {/* Hurricane Simulation Controls - Only show for US map */}
        {isUSMap && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 40,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              padding: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Hurricane Simulation
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showHurricane}
                  onChange={(e) => setShowHurricane(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="caption">
                  Show Hurricane Ian
                </Typography>
              }
            />
          </Box>
        )}
        
        {/* UPDATED CONTAINER WITH BETTER SPACING USING MERCATOR */}
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: isUSMap ? mapHeight * 0.7 : mapHeight, // Reduce height significantly for US map
            padding: isUSMap ? '4px 4px 20px 4px' : '18px', // Minimal top/side padding, more bottom padding
            transition: '0.5s height',
            display: 'flex',
            alignItems: isUSMap ? 'flex-start' : 'center', // Align to top for US map
            justifyContent: 'center',
            overflow: 'hidden',
            marginTop: isUSMap ? '-20px' : '0px', // Pull US map up significantly
            marginBottom: isUSMap ? '-30px' : '0px', // Pull content below up
            position: 'relative',
            background: showHurricane ? '#f0f8ff' : 'transparent', // Ocean blue when showing hurricane
          }}>
          {features && features.length > 0 ? (
            <>
              <ResponsiveGeoMap
                fitProjection
                isInteractive={!showHurricane} // Disable interaction during hurricane simulation
                borderWidth={2}
                borderColor="#666666"
                features={features}
                // USING MERCATOR BUT WITH BETTER SETTINGS FOR US MAP
                projectionType="mercator"
                projectionScale={isUSMap ? 800 : 100} // Higher scale for US map
                projectionTranslation={[0.5, isUSMap ? 0.25 : 0.5]} // Move US map way up
                projectionRotation={[95, 0, 0]} // Center US map better (rotate to center US)
                {...mapProps}
              />
              
              {/* Hurricane Overlay - Only show for US map */}
              {isUSMap && showHurricane && (
                <LottieHurricaneOverlay

                  mapWidth={mapDimensions.width}
                  mapHeight={mapDimensions.height}
                  onComplete={() => {
                    console.log('🌀 Hurricane Ian simulation completed!');
                    // Optionally auto-hide hurricane after completion
                    // setTimeout(() => setShowHurricane(false), 3000);
                  }}
                />
              )}
            </>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              style={{ color: '#666' }}>
              Loading map...
            </Box>
          )}
        </div>
        
        {/* Hurricane Information Panel - Only show when hurricane is active */}
        {isUSMap && showHurricane && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              mx: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: '#FF6B9D' }}>
              🌀 Hurricane Ian Simulation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Hurricane Ian was a devastating Category 4 hurricane that struck Florida in September 2022. 
              It made landfall near Fort Myers with 150 mph winds, causing catastrophic damage across Southwest and Central Florida.
            </Typography>
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
              💡 This animation shows the storm's actual 6-day trajectory and intensity changes. 
              Toggle off to return to sales data visualization.
            </Typography>
          </Box>
        )}
        
        <Disclaimer />
      </AnimatedEnter>
    );
  },
);

MapSummaryChart.displayName = 'MapSummaryChart';

export default MapSummaryChart;