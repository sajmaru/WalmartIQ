// src/charts/Dashboard/SbuMapChart.js - Updated from CropMapChart
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
  SBU_COLORS,
  SALES_METRICS_NAMES,
  SALES_METRICS_UNITS,
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

const SbuMapChart = memo(({ on = 'gmv', setMapHeight = () => {} }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = USA_STATE_CODE,
    sbuCode,
    year = LATEST_YEAR,
  } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== USA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/dashboard/sbuMap?year=${year}&stateCode=${stateCode}&sbuCode=${sbuCode}&on=${on}`,
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

    const baseColor = SBU_COLORS[sbuCode] || '#4a90e2';
    const sbuColor = color(baseColor);

    const data = values.reduce((acc, { location, years }) => {
      const id =
        stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === USA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];

      const value = years[0]?.value || 0;
      const opacity = maxValue > 0 ? 0.3 + (0.7 * value) / maxValue : 0.5;
      const locationColor = sbuColor.copy({ opacity });

      return {
        ...acc,
        [id]: {
          name,
          locationColor: locationColor.toString(),
          years: years
            .slice(0, on === 'units' ? 1 : 3)
            .map(({ year: thatYear, value }) => ({
              year: thatYear,
              value: on === 'gmv' 
                ? `$${readableNumber(value / 1000000)}M`
                : on === 'units'
                ? `${readableNumber(value / 1000)}K`
                : `$${readableNumber(value)}`,
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
          SBU_COLORS[UNASSIGNED_SBU_CODE] ||
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
          let targetStateCode = getStateCodeFromName(stateName);
          
          if (!targetStateCode && feature.id) {
            targetStateCode = FIPS_TO_STATE_CODE[feature.id];
          }

          if (targetStateCode) {
            goTo({
              stateCode: targetStateCode,
              sbuCode,
              year,
            });
          }
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
                - {SALES_METRICS_NAMES[on]} ({SALES_METRICS_UNITS[on]})
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
  }, [values, stateCode, sbuCode, year, goTo, on]);

  return (
    <AnimatedEnter>
      <Box
        ref={mapRef}
        style={{ 
          width: '100%', 
          height: isUSMap ? mapHeight * 0.7 : mapHeight,
          padding: isUSMap ? '4px 4px 20px 4px' : '18px',
          display: 'flex',
          alignItems: isUSMap ? 'flex-start' : 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: isUSMap ? '-20px' : '0px',
          marginBottom: isUSMap ? '-30px' : '0px',
        }}>
        {features && features.length > 0 ? (
          <ResponsiveGeoMap
            fitProjection
            isInteractive
            borderWidth={2}
            borderColor="#666666"
            features={features}
            projectionType="mercator"
            projectionScale={isUSMap ? 800 : 100}
            projectionTranslation={[0.5, isUSMap ? 0.25 : 0.5]}
            projectionRotation={[95, 0, 0]}
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

SbuMapChart.displayName = 'SbuMapChart';

export default SbuMapChart;