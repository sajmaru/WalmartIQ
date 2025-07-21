import { Box } from '@mui/material';
import { TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import useConstants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

import {
  ALL_MONTHS_VALUE,
  API_HOST_URL,
  MONTH_NAMES,
  STATE_CODES,
  STATE_NAMES,
  USA_STATE_CODE,
  WEATHER_COLORS,
  WEATHER_PARAMS,
  WEATHER_UNITS,
  FIPS_TO_STATE_CODE,
  getStateCodeFromName,
} from '../../constants';
import { readableNumber } from '../../helpers';

export const WeatherMap = memo(({ setMapHeight = () => {}, month, on }) => {
  const { LATEST_YEAR } = useConstants();
  const { goTo, stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== USA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/weather/getWeatherData?stateCode=${stateCode}&on=${on}&year=${year}`,
  );

  const mapRef = useRef(null);
  const mapHeight = mapRef.current?.clientWidth || 700;

  useEffect(
    () => setMapHeight && setMapHeight(mapHeight),
    [mapHeight, setMapHeight],
  );

  const getSelectedValue = useCallback(
    (datum) => (month === ALL_MONTHS_VALUE ? datum.value : datum.series[month]),
    [month],
  );

  const mapProps = useMemo(() => {
    if (!values) return {};
    const [minValue, maxValue] = values.reduce(
      ([accMin, accMax], { years: [datum] }) => {
        const thisValue = getSelectedValue(datum);
        return [
          accMin < thisValue ? accMin : thisValue,
          accMax > thisValue ? accMax : thisValue,
        ];
      },
      [Infinity, 0],
    );

    const [valueOffset, valueRange] =
      maxValue === minValue ? [0, 1] : [minValue, maxValue - minValue];

    const paramColor = color(WEATHER_COLORS[on]);
    const data = values.reduce((accData, { location, years }) => {
      const id =
        stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === USA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];
      const thisValue = getSelectedValue(years[0]);
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
        console.log('🗺️ Weather map feature clicked:', { stateName, district: districtName });

        if (stateCode === USA_STATE_CODE && stateName) {
          // Use the robust helper function for state code lookup
          let targetStateCode = getStateCodeFromName(stateName);
          
          // Fallback: Try looking in data object
          if (!targetStateCode && data[stateName]) {
            // Try to find the state code from available data
            const stateEntries = Object.entries(STATE_NAMES);
            const foundEntry = stateEntries.find(([code, name]) => 
              name.toUpperCase() === stateName.toUpperCase()
            );
            targetStateCode = foundEntry?.[0];
          }

          console.log('🗺️ Weather map state lookup:', {
            originalName: stateName,
            targetStateCode,
          });

          if (targetStateCode && targetStateCode !== USA_STATE_CODE) {
            console.log('🗺️ Navigating to weather state:', targetStateCode);
            goTo({ stateCode: targetStateCode }, '/weather');
          } else {
            console.warn('🗺️ State code not found for weather map:', stateName);
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
                <b>
                  {stateCode === USA_STATE_CODE ? stateName : districtName} -{' '}
                  {WEATHER_PARAMS[on]}
                </b>
              </>
            }
            rows={
              data[id]
                ? data[id].years
                    .slice(0, 3)
                    .map((datum) => [
                      '',
                      datum.year +
                        (month === ALL_MONTHS_VALUE
                          ? ''
                          : ` ${MONTH_NAMES[month]}`),
                      `${readableNumber(getSelectedValue(datum))}${
                        WEATHER_UNITS[on]
                      }`,
                    ])
                : [['', 'No data available', '']]
            }
          />
        );
      },
    };
  }, [values, stateCode, goTo, month, on, getSelectedValue]);

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
export default WeatherMap;