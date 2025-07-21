import { Box } from '@mui/material';
import { Chip, TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import { memo, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import {
  API_HOST_URL,
  CROP_COLORS,
  CROP_METRICS_NAMES,
  CROP_METRICS_UNITS,
  CROP_NAMES,
  STATE_CODES,
  STATE_NAMES,
  UNASSIGNED_CROP_CODE,
  USA_STATE_CODE,
  FIPS_TO_STATE_CODE,
  getStateCodeFromName,
} from '../../constants';
import { readableNumber } from '../../helpers';
import useConstants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

const MapSummaryChart = memo(
  ({ on = 'production', setMapHeight = () => {} }) => {
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

    useEffect(() => setMapHeight(mapHeight), [mapHeight, setMapHeight]);

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
        ([accData, accLegend], { location, topCrops }) => {
          const id =
            stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
          const name =
            stateCode === USA_STATE_CODE
              ? STATE_NAMES[location]
              : location.split('-')[1];
          const topCrop = topCrops[0]?.crop;

          if (!topCrop) {
            return [accData, accLegend];
          }

          // Get color for the top crop
          const baseColor = CROP_COLORS[topCrop] || '#4a90e2';
          const cropColor = color(baseColor);
          const locationColor = cropColor.copy({ opacity: 0.7 });

          return [
            {
              ...accData,
              [id]: {
                name,
                locationColor: locationColor.toString(),
                topCrops: topCrops
                  .slice(0, 3)
                  .map(({ crop: cropCode, value }) => ({
                    cropCode,
                    crop: CROP_NAMES[cropCode] || cropCode,
                    cropColor: CROP_COLORS[cropCode] || '#dddddd',
                    value: readableNumber(value),
                  })),
              },
            },
            {
              ...accLegend,
              [CROP_NAMES[topCrop] || topCrop]: cropColor.toString(),
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
              CROP_COLORS[UNASSIGNED_CROP_CODE] ||
              '#e0e0e0';

            return fillColor;
          },
          borderWidth: () => 2,
          borderColor: () => '#666666',
          onClick: (feature) => {
            console.log('🗺️ Map feature clicked:', feature); // Debug log

            const {
              properties: { st_nm: stateName, district: districtName },
            } = feature;

            if (stateCode === USA_STATE_CODE && stateName) {
              // Use the robust helper function for state code lookup
              let targetStateCode = getStateCodeFromName(stateName);
              
              // Fallback: Try FIPS code lookup if available
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
                // Show available state codes for debugging
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
            return (
              <TableTooltip
                title={
                  <>
                    <b>
                      {stateCode === USA_STATE_CODE ? stateName : districtName}
                    </b>{' '}
                    - {CROP_METRICS_NAMES[on]} ({CROP_METRICS_UNITS[on]})
                  </>
                }
                rows={
                  data[id]
                    ? data[id].topCrops.map(({ crop, cropColor, value }) => [
                        <Chip key={crop} color={cropColor} />,
                        crop,
                        value,
                      ])
                    : [[CROP_NAMES[UNASSIGNED_CROP_CODE], '', '']]
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
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          marginTop={2}
          marginBottom={-3}>
          {Object.entries(legend).map(([crop, cropColor]) => (
            <Box component="span" padding={1} key={`legend-${crop}`}>
              <Chip
                style={{
                  marginLeft: 6,
                  marginRight: 6,
                  display: 'inline-block',
                  backgroundColor: cropColor,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                }}
              />
              {crop}
            </Box>
          ))}
        </Box>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: mapHeight,
            padding: 18,
            transition: '0.5s height',
          }}>
          {features && features.length > 0 ? (
            <ResponsiveGeoMap
              fitProjection
              isInteractive
              borderWidth={2}
              borderColor="#666666"
              features={features}
              {...mapProps}
            />
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
        <Disclaimer />
      </AnimatedEnter>
    );
  },
);

MapSummaryChart.displayName = 'MapSummaryChart';

export default MapSummaryChart;