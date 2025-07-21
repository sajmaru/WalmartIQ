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
  FIPS_TO_STATE_CODE,
  getStateCodeFromName,
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

  // Determine if this is the US country map
  const isUSMap = stateCode === USA_STATE_CODE;

  const mapProps = useMemo(() => {
    if (!values || values.length === 0) {
      return {
        fillColor: () => '#f0f0f0',
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
        console.log('🗺️ Crop map feature clicked:', feature);

        const {
          properties: { st_nm: stateName, district: districtName },
        } = feature;

        if (stateCode === USA_STATE_CODE && stateName) {
          let targetStateCode = getStateCodeFromName(stateName);
          
          if (!targetStateCode && feature.id) {
            targetStateCode = FIPS_TO_STATE_CODE[feature.id];
          }

          console.log('🗺️ Crop map state lookup:', {
            originalName: stateName,
            targetStateCode,
            cropCode,
            feature
          });

          if (targetStateCode) {
            console.log('🗺️ Navigating to state with crop:', { targetStateCode, cropCode });
            goTo({
              stateCode: targetStateCode,
              cropCode,
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
      {/* UPDATED CONTAINER WITH BETTER SPACING USING MERCATOR */}
      <Box
        ref={mapRef}
        style={{ 
          width: '100%', 
          height: isUSMap ? mapHeight * 0.7 : mapHeight, // Reduce height significantly for US map
          padding: isUSMap ? '4px 4px 20px 4px' : '18px', // Minimal top/side padding, more bottom padding
          display: 'flex',
          alignItems: isUSMap ? 'flex-start' : 'center', // Align to top for US map
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: isUSMap ? '-20px' : '0px', // Pull US map up significantly
          marginBottom: isUSMap ? '-30px' : '0px', // Pull content below up
        }}>
        {features && features.length > 0 ? (
          <ResponsiveGeoMap
            fitProjection
            isInteractive
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