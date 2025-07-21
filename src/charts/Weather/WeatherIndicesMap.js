import { Box } from '@mui/material';
import { TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import { memo, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import useContants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

import {
  API_HOST_URL,
  STATE_CODES,
  STATE_NAMES,
  USA_STATE_CODE,
  WEATHER_INDICES,
  WEATHER_INDICES_COLORS,
  WEATHER_INDICES_UNITS,
  FIPS_TO_STATE_CODE,
  getStateCodeFromName,
} from '../../constants';
import { readableNumber } from '../../helpers';

export const WeatherIndicesMap = memo(({ setMapHeight = () => {}, on }) => {
  const { LATEST_YEAR } = useContants();
  const { goTo, stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== USA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/${on}/get${on.toUpperCase()}Data?stateCode=${stateCode}&year=${year}&n=3`,
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
    if (!values) return {};
    const [minValue, maxValue] = values.reduce(
      ([accMin, accMax], { years: [{ value: thisValue }] }) => [
        accMin < thisValue ? accMin : thisValue,
        accMax > thisValue ? accMax : thisValue,
      ],
      [Infinity, 0],
    );

    const [valueOffset, valueRange] =
      maxValue === minValue ? [0, 1] : [minValue, maxValue - minValue];

    const paramColor = color(WEATHER_INDICES_COLORS[on]);
    const data = values.reduce((accData, { location, years }) => {
      const id =
        stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === USA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];
      const thisValue = years[0].value;
      const locationColor = paramColor.copy({
        opacity: 0.3 + (0.7 * (thisValue - valueOffset)) / valueRange,
      });
      return {
        ...accData,
        [id]: {
          name,
          locationColor,
          years,
        },
      };
    }, {});

    return {
      fillColor: (props) => {
        const {
          properties: { st_nm: stateName, district: districtName },
        } = props;
        return (
          (stateCode === USA_STATE_CODE
            ? data[stateName]?.locationColor
            : data[`${stateName}-${districtName}`.toUpperCase()]
                ?.locationColor) || '#ffffff'
        );
      },
      onClick: ({
        properties: { st_nm: stateName, district: districtName },
      }) => {
        console.log('🗺️ Weather indices map feature clicked:', { stateName, district: districtName });

        if (stateCode === USA_STATE_CODE && stateName) {
          let targetStateCode = getStateCodeFromName(stateName);
          
          if (!targetStateCode && data[stateName]) {
            const stateEntries = Object.entries(STATE_NAMES);
            const foundEntry = stateEntries.find(([code, name]) => 
              name.toUpperCase() === stateName.toUpperCase()
            );
            targetStateCode = foundEntry?.[0];
          }

          console.log('🗺️ Weather indices map state lookup:', {
            originalName: stateName,
            targetStateCode,
            hasData: !!data[stateName]
          });

          if (targetStateCode && targetStateCode !== USA_STATE_CODE && data[stateName]) {
            console.log('🗺️ Navigating to weather indices state:', targetStateCode);
            goTo({ stateCode: targetStateCode }, '/weather');
          } else {
            console.warn('🗺️ State code not found or no weather indices data for:', stateName);
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
              <b>
                {stateCode === USA_STATE_CODE ? stateName : districtName} -{' '}
                {WEATHER_INDICES[on]}
              </b>
            }
            rows={
              data[id]
                ? data[id].years
                    .slice(0, 3)
                    .map((datum) => [
                      '',
                      datum.year,
                      `${readableNumber(datum.value)}${
                        WEATHER_INDICES_UNITS[on]
                      }`,
                    ])
                : [['', 'No data available', '']]
            }
          />
        );
      },
    };
  }, [values, stateCode, goTo, on]);

  return (
    <AnimatedEnter>
      {/* UPDATED CONTAINER WITH DYNAMIC PADDING AND SPACING */}
      <Box
        ref={mapRef}
        style={{ 
          width: '100%', 
          height: isUSMap ? mapHeight * 0.75 : mapHeight, // Reduce height for US map
          padding: isUSMap ? '2px' : '18px', // Minimal padding for US map
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: isUSMap ? '-10px' : '0px', // Pull US map up
        }}>
        <ResponsiveGeoMap
          fitProjection
          isInteractive
          borderWidth={2}
          borderColor="#404040"
          features={features}
          // UPDATED PROJECTION SETTINGS FOR US MAP
          projectionType={isUSMap ? 'albersUsa' : 'mercator'}
          projectionScale={isUSMap ? 1200 : 100}
          projectionTranslation={[0.5, isUSMap ? 0.35 : 0.5]} // Move US map up more
          {...mapProps}
        />
      </Box>
      <Disclaimer />
    </AnimatedEnter>
  );
});
export default WeatherIndicesMap;