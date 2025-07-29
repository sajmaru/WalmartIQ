// src/charts/Pricing/InteractiveGMVChart.js
import React, { memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveLine } from '@nivo/line';
import Disclaimer from '../../components/Disclaimer';
import { readableNumber } from '../../helpers';

// Add custom cursor styling for high-residual points
const interactivePointStyles = `
  .nivo-line-point[data-high-residual="true"] {
    cursor: pointer !important;
    filter: drop-shadow(0 0 4px rgba(255, 34, 34, 0.6));
  }
  
  .nivo-line-point[data-high-residual="true"]:hover {
    filter: drop-shadow(0 0 8px rgba(255, 34, 34, 0.8));
    transform: scale(1.1);
    transition: all 0.2s ease;
  }
`;

// Add styles to document head if not already present
if (!document.getElementById('interactive-point-styles')) {
  const style = document.createElement('style');
  style.id = 'interactive-point-styles';
  style.textContent = interactivePointStyles;
  document.head.appendChild(style);
}

export const InteractiveGMVChart = memo(({
  actualGMV,
  forecastGMV,
  years,
  residualExplanations,
  onPointClick,
  colors = ['#1976d2', '#ff9800']
}) => {
  // Calculate residuals and identify high-variance points
  const { chartData, highResidualPoints } = useMemo(() => {
    const residuals = actualGMV.map((actual, index) => ({
      year: years[index],
      residual: actual - forecastGMV[index],
      index,
      hasExplanation: Boolean(residualExplanations[index])
    }));

    // Threshold for "high" residual - 3% of average forecast
    const avgForecast = forecastGMV.reduce((sum, val) => sum + val, 0) / forecastGMV.length;
    const residualThreshold = avgForecast * 0.03;

    const highResidualPoints = residuals.filter(point => 
      Math.abs(point.residual) > residualThreshold && point.hasExplanation
    );

    const chartData = [
      {
        id: 'Actual GMV',
        data: actualGMV.map((value, index) => ({
          x: years[index],
          y: value,
          index,
          isHighResidual: highResidualPoints.some(p => p.index === index)
        })),
        color: colors[0]
      },
      {
        id: 'Forecast GMV',
        data: forecastGMV.map((value, index) => ({
          x: years[index],
          y: value,
          index,
          isHighResidual: false
        })),
        color: colors[1]
      }
    ];

    return { chartData, highResidualPoints };
  }, [actualGMV, forecastGMV, years, residualExplanations, colors]);

  // Simplified point click handler for the mesh layer
  const handlePointClick = (point) => {
    try {
      if (!point || !point.data) return;
      
      const isActualGMV = point.serieId === 'Actual GMV';
      const dataIndex = point.data.index;
      const isHighResidual = point.data.isHighResidual;

      if (isActualGMV && isHighResidual && onPointClick && residualExplanations[dataIndex]) {
        onPointClick(dataIndex, residualExplanations[dataIndex]);
      }
    } catch (error) {
      console.error('Point click error:', error);
    }
  };

  return (
    <>
      <Box style={{ height: 280 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 24, right: 24, bottom: 60, left: 80 }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto'
          }}
          curve="monotoneX"
          lineWidth={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Year',
            legendOffset: 40,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'GMV ($)',
            legendOffset: -60,
            legendPosition: 'middle',
            format: (value) => `$${readableNumber(value)}`
          }}
          theme={{ 
            fontFamily: 'Poppins, sans-serif',
            axis: {
              legend: {
                text: {
                  fontSize: 12,
                  fontWeight: 600
                }
              }
            }
          }}
          isInteractive
          useMesh
          colors={{ datum: 'color' }}
          enablePoints={false}
          layers={[
            'grid',
            'markers',
            'axes',
            'areas',
            'crosshair',
            'lines',
            'points',
            'slices',
            'mesh',
            'legends',
            // Custom layer for high-residual dots
            ({ xScale, yScale, series }) => {
              const highResidualDots = [];
              
              series.forEach((serie) => {
                if (serie.id === 'Actual GMV') {
                  serie.data.forEach((point) => {
                    if (point.data.isHighResidual) {
                      const x = xScale(point.data.x);
                      const y = yScale(point.data.y);
                      
                      highResidualDots.push(
                        <g key={`high-residual-${point.data.index}`}>
                          {/* Outer glow circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r={12}
                            fill="rgba(255, 34, 34, 0.3)"
                            stroke="none"
                          />
                          {/* Main clickable dot */}
                          <circle
                            cx={x}
                            cy={y}
                            r={8}
                            fill="#ff2222"
                            stroke="#ffffff"
                            strokeWidth={3}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (onPointClick && residualExplanations[point.data.index]) {
                                onPointClick(point.data.index, residualExplanations[point.data.index]);
                              }
                            }}
                          />
                          {/* Pulsing animation circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r={8}
                            fill="none"
                            stroke="#ff2222"
                            strokeWidth={2}
                            opacity={0.7}
                          >
                            <animate
                              attributeName="r"
                              values="8;14;8"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.7;0;0.7"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      );
                    }
                  });
                }
              });
              
              return highResidualDots;
            }
          ]}
          legends={[
            {
              anchor: 'top-left',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -20,
              itemsSpacing: 20,
              itemDirection: 'left-to-right',
              itemWidth: 100,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          enableGridX={false}
          gridYValues={5}
          yFormat={(value) => `$${readableNumber(value)}`}
          onClick={handlePointClick}
          tooltip={({ point }) => {
            try {
              if (!point || !point.data) return null;
              
              return (
                <div
                  style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: '200px'
                  }}
                >
                  <strong>{point.serieId}</strong>
                  <br />
                  Year: {point.data.xFormatted}
                  <br />
                  GMV: ${readableNumber(point.data.yFormatted)}
                </div>
              );
            } catch (error) {
              console.warn('Tooltip error:', error);
              return null;
            }
          }}
        />
      </Box>
      <Disclaimer />
    </>
  );
});

export default InteractiveGMVChart;