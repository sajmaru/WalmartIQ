import React, { useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import useTheme from '@mui/styles/useTheme';
import { ResponsiveLine } from '@nivo/line';
import { BasicTooltip } from '@nivo/tooltip';
import { readableNumber } from '../helpers';

const MiniGraph = ({ series, color, style, years = [], ...props }) => {
  const theme = useTheme();
  const data = useMemo(
    () => [
      {
        id: 'data',
        data: series.map((value, index) => ({ x: years[index], y: value })),
        color: color || theme.palette.primary.dark,
      },
    ],
    [series, color, theme, years],
  );

  const renderTooltip = useCallback(
    ({
      point: {
        color: chipColor,
        data: { xFormatted, yFormatted },
      },
    }) => {
      return (
        <BasicTooltip
          color={chipColor}
          id={`${xFormatted}`}
          enableChip
          value={`${yFormatted} Tonnes`}
        />
      );
    },
    [],
  );

  return (
    <Box
      style={{
        alignSelf: 'center',
        justifySelf: 'center',
        height: 80,
        width: 180,
        margin: 16,
        ...style,
      }}>
      <ResponsiveLine
        {...{ data }}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          reverse: false,
        }}
        yFormat={readableNumber}
        colors={{ datum: 'color' }}
        curve="monotoneX"
        lineWidth={4}
        axisTop={null}
        axisRight={null}
        axisLeft={null}
        axisBottom={null}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        isInteractive
        animate
        useMesh
        legends={[]}
        tooltip={renderTooltip}
        {...props}
      />
    </Box>
  );
};

export default MiniGraph;
