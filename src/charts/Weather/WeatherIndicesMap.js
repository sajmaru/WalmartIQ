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
  INDIA_STATE_CODE,
  STATE_CODES,
  STATE_NAMES,
  WEATHER_INDICES,
  WEATHER_INDICES_COLORS,
  WEATHER_INDICES_UNITS,
} from '../../constants';
import { readableNumber } from '../../helpers';

export const WeatherIndicesMap = memo(({ setMapHeight = () => {}, on }) => {
  const { LATEST_YEAR } = useContants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/${on}/get${on.toUpperCase()}Data?stateCode=${stateCode}&year=${year}&n=3`,
  );

  const mapRef = useRef(null);
  const mapHeight = mapRef.current?.clientWidth || 700;

  useEffect(
    () => setMapHeight && setMapHeight(mapHeight),
    [mapHeight, setMapHeight],
  );

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
        stateCode === INDIA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === INDIA_STATE_CODE
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
          (stateCode === INDIA_STATE_CODE
            ? data[stateName]?.locationColor
            : data[`${stateName}-${districtName}`.toUpperCase()]
                ?.locationColor) || '#ffffff'
        );
      },
      onClick: ({
        properties: { st_nm: stateName, district: districtName },
      }) => {
        const id =
          stateCode === INDIA_STATE_CODE
            ? stateName
            : `${stateName}-${districtName}`.toUpperCase();
        if (stateCode === INDIA_STATE_CODE && !!data[id])
          goTo({ stateCode: STATE_CODES[stateName] }, '/weather');
      },
      tooltip: ({
        feature: {
          properties: { st_nm: stateName, district: districtName },
        },
      }) => {
        const id =
          stateCode === INDIA_STATE_CODE
            ? stateName
            : `${stateName}-${districtName}`.toUpperCase();
        return (
          <TableTooltip
            title={
              <b>
                {stateCode === INDIA_STATE_CODE ? stateName : districtName} -{' '}
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
      <Box
        ref={mapRef}
        style={{ width: '100%', height: mapHeight, padding: 18 }}>
        <ResponsiveGeoMap
          fitProjection
          isInteractive
          borderWidth={2}
          borderColor="#404040"
          features={features}
          {...mapProps}
        />
      </Box>
      <Disclaimer />
    </AnimatedEnter>
  );
});
export default WeatherIndicesMap;

