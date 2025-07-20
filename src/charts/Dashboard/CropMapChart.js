import { Box } from '@mui/material';
import { TableTooltip } from '@nivo/tooltip';
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
  STATE_CODES,
  STATE_NAMES,
  UNASSIGNED_CROP_CODE,
  USA_STATE_CODE,
} from '../../constants';
import { readableNumber } from '../../helpers';
import useConstants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

const CropMapChart = memo(({ on = 'production', setMapHeight = () => {} }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = USA_STATE_CODE,
    cropCode,
    year = LATEST_YEAR,
  } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== USA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/dashboard/cropMap?year=${year}&stateCode=${stateCode}&cropCode=${cropCode}&on=${on}`,
    {
      fallbackData: [],
    },
  );

  const mapRef = useRef(null);
  const mapHeight = mapRef.current?.clientWidth || 700;

  useEffect(
    () => setMapHeight && setMapHeight(mapHeight),
    [mapHeight, setMapHeight],
  );

  const mapProps = useMemo(() => {

    if (!values || values.length === 0) {
      // Return default styling when no data
      return {
        fillColor: () => '#f0f0f0', // Light gray for no data
        borderWidth: () => 1,
        borderColor: () => '#ccc',
        onClick: () => {},
        tooltip: () => null,
      };
    }

    const maxValue = values.reduce(
      (acc, { years }) => (years[0]?.value > acc ? years[0].value : acc),
      0,
    );

    // Get base color for the crop, with fallback
    const baseColor = CROP_COLORS[cropCode] || '#4a90e2';
    const cropColor = color(baseColor);

    const data = values.reduce((acc, { location, years }) => {
      const id =
        stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === USA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];

      const value = years[0]?.value || 0;
      const opacity = maxValue > 0 ? 0.3 + (0.7 * value) / maxValue : 0.5;
      const locationColor = cropColor.copy({ opacity });

      return {
        ...acc,
        [id]: {
          name,
          locationColor: locationColor.toString(),
          years: years
            .slice(0, on === 'area' ? 1 : 3)
            .map(({ year: thatYear, value }) => ({
              year: thatYear,
              value: readableNumber(value),
            })),
        },
      };
    }, {});

    return {
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

        const {
          properties: { st_nm: stateName, district: districtName },
        } = feature;

        if (stateCode === USA_STATE_CODE && stateName) {
          // Clicking on India map - navigate to state
          const targetStateCode = STATE_CODES[stateName];
         

          if (targetStateCode) {
            goTo({
              stateCode: targetStateCode,
              cropCode,
              year,
            });
          } else {
            console.warn('🗺️ State code not found for:', stateName);
          }
        } else if (stateCode !== USA_STATE_CODE && districtName) {
          // Clicking on state map - could navigate to district view if implemented
          // For now, just log the click since district view might not be implemented
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
                <b>{stateCode === USA_STATE_CODE ? stateName : districtName}</b>{' '}
                - {CROP_METRICS_NAMES[on]} ({CROP_METRICS_UNITS[on]})
              </>
            }
            rows={
              data[id]
                ? data[id].years.map(({ year: thatYear, value }) => [
                    '',
                    thatYear,
                    value,
                  ])
                : [['', 'Data not available', '']]
            }
          />
        );
      },
    };
  }, [values, stateCode, cropCode, year, goTo, on]);

  return (
    <AnimatedEnter>
      <Box
        ref={mapRef}
        style={{ width: '100%', height: mapHeight, padding: 18 }}>
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
      </Box>
      <Disclaimer />
    </AnimatedEnter>
  );
});

CropMapChart.displayName = 'CropMapChart';

export default CropMapChart;

