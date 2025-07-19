import React, { useMemo, useRef, useEffect, memo } from 'react';
import { Box } from '@material-ui/core';
import { TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import useSWR from 'swr';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import useMap from '../../hooks/useMap';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';
import {
  STATE_NAMES,
  STATE_CODES,
  INDIA_STATE_CODE,
  CROP_COLORS,
  CROP_METRICS_NAMES,
  CROP_METRICS_UNITS,
  UNASSIGNED_CROP_CODE,
  API_HOST_URL,
} from '../../constants';
import { readableNumber } from '../../helpers';

const CropMapChart = memo(({ on, setMapHeight }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    cropCode,
    year = LATEST_YEAR,
  } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/dashboard/cropMap?year=${year}&stateCode=${stateCode}&cropCode=${cropCode}&on=${on}`,
  );

  const mapRef = useRef(null);
  const mapHeight = mapRef.current?.clientWidth || 700;

  useEffect(() => setMapHeight && setMapHeight(mapHeight), [
    mapHeight,
    setMapHeight,
  ]);

  const mapProps = useMemo(() => {
    if (!values) return {};
    const maxValue = values.reduce(
      (acc, { years }) => (years[0].value > acc ? years[0].value : acc),
      0,
    );
    const cropColor = color(CROP_COLORS[cropCode]);
    const data = values.reduce((acc, { location, years }) => {
      const id =
        stateCode === INDIA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === INDIA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];
      const locationColor = cropColor.copy({
        opacity: 0.3 + (0.7 * years[0].value) / maxValue,
      });
      return {
        ...acc,
        [id]: {
          name,
          locationColor,
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
      fillColor: (props) => {
        const {
          properties: { st_nm: stateName, district: districtName },
        } = props;
        return (
          (stateCode === INDIA_STATE_CODE
            ? data[stateName]?.locationColor
            : data[`${stateName}-${districtName}`.toUpperCase()]
                ?.locationColor) || CROP_COLORS[UNASSIGNED_CROP_CODE]
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
          goTo({ stateCode: STATE_CODES[stateName], cropCode, year });
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
              <>
                <b>
                  {stateCode === INDIA_STATE_CODE ? stateName : districtName}
                </b>{' '}
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
        style={{ widht: '100%', height: mapHeight, padding: 18 }}>
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
export default CropMapChart;
