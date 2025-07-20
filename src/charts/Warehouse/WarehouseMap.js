import React, { useMemo, useRef, useEffect, memo } from 'react';
import { Box, useTheme } from '@mui/material';
import { TableTooltip } from '@nivo/tooltip';
import { color } from 'd3-color';
import useSWR from 'swr';
import { ResponsiveGeoMap } from '../../components/GeoMap';
import AnimatedEnter from '../../components/AnimatedEnter';
import Disclaimer from '../../components/Disclaimer';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';
import {
  STATE_NAMES,
  STATE_CODES,
  INDIA_STATE_CODE,
  API_HOST_URL,
} from '../../constants';
import { readableNumber } from '../../helpers';

export const WarehouseMap = memo(({ setMapHeight = () => {} }) => {
  const { goTo, stateCode = INDIA_STATE_CODE } = useRouting();
  const { data: features } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/storage/getStorageSummary?stateCode=${stateCode}`,
  );
  const theme = useTheme();

  const mapRef = useRef(null);
  const mapHeight = useMemo(
    () => mapRef?.current?.clientWidth * 1.12963 || 700,
    [mapRef],
  );

  useEffect(
    () => setMapHeight && setMapHeight(mapHeight),
    [mapHeight, setMapHeight],
  );

  const mapProps = useMemo(() => {
    if (!values) return {};
    const [minCapacity, maxCapacity] = values.reduce(
      ([accMinCapacity, accMaxCapacity], { warehouses }) => {
        const totalCapacity = warehouses.reduce(
          (capacityTotal, { capacity }) => capacityTotal + capacity,
          0,
        );
        return [
          accMinCapacity < totalCapacity ? accMinCapacity : totalCapacity,
          accMaxCapacity > totalCapacity ? accMaxCapacity : totalCapacity,
        ];
      },
      [Infinity, 0],
    );
    const [capacityOffset, capacityRange] =
      maxCapacity === minCapacity
        ? [0, 1]
        : [minCapacity, maxCapacity - minCapacity];

    const cropColor = color(theme.palette.primary.main);
    const data = values.reduce((acc, { location, warehouses }) => {
      const id =
        stateCode === INDIA_STATE_CODE ? STATE_NAMES[location] : location;
      const name =
        stateCode === INDIA_STATE_CODE
          ? STATE_NAMES[location]
          : location.split('-')[1];
      const locationColor = cropColor.copy({
        opacity:
          0.3 +
          (0.7 *
            warehouses.reduce(
              (capacityTotal, { capacity }) => capacityTotal + capacity,
              0,
            ) -
            capacityOffset) /
            capacityRange,
      });
      return {
        ...acc,
        [id]: {
          name,
          locationColor,
          warehouses,
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
          goTo({ stateCode: STATE_CODES[stateName] }, '/warehouse');
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
                </b>
              </>
            }
            rows={
              data[id]
                ? [
                    ['Type', 'Capacity', 'Count'],
                    ...data[id].warehouses.map(({ type, capacity, count }) => [
                      type,
                      readableNumber(capacity),
                      count,
                    ]),
                  ]
                : [['', 'No warehouses', '']]
            }
          />
        );
      },
    };
  }, [values, stateCode, goTo, theme.palette.primary.main]);

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
export default WarehouseMap;

