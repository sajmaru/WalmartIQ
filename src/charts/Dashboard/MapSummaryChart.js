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
  SBU_COLORS,
  SALES_METRICS_NAMES,
  SALES_METRICS_UNITS,
  SBU_NAMES,
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

const MapSummaryChart = memo(
  ({ on = 'gmv', setMapHeight = () => {} }) => {
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

    // Determine if this is the US country map
    const isUSMap = stateCode === USA_STATE_CODE;

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
        ([accData, accLegend], { location, topSBUs }) => {
          const id =
            stateCode === USA_STATE_CODE ? STATE_NAMES[location] : location;
          const name =
            stateCode === USA_STATE_CODE
              ? STATE_NAMES[location]
              : location.split('-')[1];
          const topSBU = topSBUs[0]?.sbu;

          if (!topSBU) {
            return [accData, accLegend];
          }

          // Get color for the top SBU
          const baseColor = SBU_COLORS[topSBU] || '#4a90e2';
          const sbuColor = color(baseColor);
          const locationColor = sbuColor.copy({ opacity: 0.7 });

          return [
            {
              ...accData,
              [id]: {
                name,
                locationColor: locationColor.toString(),
                topSBUs: topSBUs
                  .slice(0, 3)
                  .map(({ sbu: sbuCode, value }) => ({
                    sbuCode,
                    sbu: SBU_NAMES[sbuCode] || sbuCode,
                    sbuColor: SBU_COLORS[sbuCode] || '#dddddd',
                    value: on === 'gmv' 
                      ? `$${readableNumber(value / 1000000)}M`
                      : on === 'units'
                      ? `${readableNumber(value / 1000)}K`
                      : `$${readableNumber(value)}`,
                  })),
              },
            },
            {
              ...accLegend,
              [SBU_NAMES[topSBU] || topSBU]: sbuColor.toString(),
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
              SBU_COLORS[UNASSIGNED_SBU_CODE] ||
              '#e0e0e0';

            return fillColor;
          },
          borderWidth: () => 2,
          borderColor: () => '#666666',
          onClick: (feature) => {
            console.log('🗺️ Map feature clicked:', feature);

            const {
              properties: { st_nm: stateName, district: districtName },
            } = feature;

            if (stateCode === USA_STATE_CODE && stateName) {
              let targetStateCode = getStateCodeFromName(stateName);
              
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
                    - {SALES_METRICS_NAMES[on]} ({SALES_METRICS_UNITS[on]})
                  </>
                }
                rows={
                  data[id]
                    ? data[id].topSBUs.map(({ sbu, sbuColor, value }) => [
                        <Chip key={sbu} color={sbuColor} />,
                        sbu,
                        value,
                      ])
                    : [[SBU_NAMES[UNASSIGNED_SBU_CODE], '', '']]
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
          {Object.entries(legend).map(([sbu, sbuColor]) => (
            <Box component="span" padding={1} key={`legend-${sbu}`}>
              <Chip
                style={{
                  marginLeft: 6,
                  marginRight: 6,
                  display: 'inline-block',
                  backgroundColor: sbuColor,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                }}
              />
              {sbu}
            </Box>
          ))}
        </Box>
        
        {/* UPDATED CONTAINER WITH BETTER SPACING USING MERCATOR */}
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: isUSMap ? mapHeight * 0.7 : mapHeight, // Reduce height significantly for US map
            padding: isUSMap ? '4px 4px 20px 4px' : '18px', // Minimal top/side padding, more bottom padding
            transition: '0.5s height',
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
        </div>
        <Disclaimer />
      </AnimatedEnter>
    );
  },
);

MapSummaryChart.displayName = 'MapSummaryChart';

export default MapSummaryChart;