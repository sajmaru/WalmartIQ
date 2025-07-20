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
    INDIA_STATE_CODE,
    STATE_CODES,
    STATE_NAMES,
    UNASSIGNED_CROP_CODE,
} from '../../constants';
import { readableNumber } from '../../helpers';
import useConstants from '../../hooks/useConstants';
import useMap from '../../hooks/useMap';
import useRouting from '../../routes/useRouting';

const MapSummaryChart = memo(({ on, setMapHeight }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  const { data: features } = useMap(stateCode, stateCode !== INDIA_STATE_CODE);
  const { data: values } = useSWR(
    `${API_HOST_URL}api/dashboard/mapSummary?year=${year}&stateCode=${stateCode}&on=${on}`,
  );

  const mapRef = useRef(null);
  const mapHeight = mapRef.current?.clientWidth || 700;

  useEffect(() => setMapHeight(mapHeight), [mapHeight, setMapHeight]);

  const { mapProps, legend } = useMemo(() => {
    if (!values) return {};
    const [data, legend] = values.reduce(
      ([accData, accLegend], { location, topCrops }) => {
        const id =
          stateCode === INDIA_STATE_CODE ? STATE_NAMES[location] : location;
        const name =
          stateCode === INDIA_STATE_CODE
            ? STATE_NAMES[location]
            : location.split('-')[1];
        const topCrop = topCrops[0].crop;
        const cropColor = color(CROP_COLORS[topCrop]);
        const locationColor = cropColor.copy({
          opacity: 0.5,
        });
        return [
          {
            ...accData,
            [id]: {
              name,
              locationColor,
              topCrops: topCrops
                .slice(0, 3)
                .map(({ crop: cropCode, value }) => ({
                  cropCode,
                  crop: CROP_NAMES[cropCode],
                  cropColor: CROP_COLORS[cropCode],
                  value: readableNumber(value),
                })),
            },
          },
          { ...accLegend, [CROP_NAMES[topCrop]]: cropColor },
        ];
      },
      [{}, {}],
    );

    return {
      mapProps: {
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
            goTo({ stateCode: STATE_CODES[stateName], year });
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
                  ? data[id].topCrops.map(({ crop, cropColor, value }) => [
                      <Chip color={cropColor} />,
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
          <Box component="span" padding={1}>
            <Chip
              style={{ marginLeft: 6, marginRight: 6, display: 'inline-block' }}
              color={cropColor}
            />
            {crop}
          </Box>
        ))}
      </Box>
      <div
        ref={mapRef}
        style={{
          widht: '100%',
          height: mapHeight,
          padding: 18,
          transition: '0.5s height',
        }}>
        <ResponsiveGeoMap
          fitProjection
          isInteractive
          borderWidth={2}
          borderColor="#404040"
          features={features}
          {...mapProps}
        />
      </div>
      <Disclaimer />
    </AnimatedEnter>
  );
});
export default MapSummaryChart;
