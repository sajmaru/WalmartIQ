/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { Fragment, useCallback, memo } from 'react';
import { SvgWrapper, withContainer, useDimensions, useTheme } from '@nivo/core';
import { useTooltip } from '@nivo/tooltip';
import { GeoMapPropTypes, GeoMapDefaultProps } from './props';
import GeoMapFeature from './GeoMapFeature';
import { useGeoMap } from './hooks';

const GeoMap = memo((props) => {
  // Merge props with defaults to ensure all required props are present
  const {
    width,
    height,
    margin: partialMargin,
    features = [],
    layers = ['features'],
    projectionType = 'mercator',
    projectionScale = 100,
    projectionTranslation = [0.5, 0.5],
    projectionRotation = [0, 0, 0],
    fitProjection = false,
    fillColor = '#dddddd',
    borderWidth = 2,
    borderColor = '#404040',
    isInteractive = true,
    onClick = () => {},
    onMouseEnter = () => {},
    onMouseMove = () => {},
    onMouseLeave = () => {},
    tooltip: Tooltip,
  } = { ...GeoMapDefaultProps, ...props };
  
  const { margin, outerWidth, outerHeight } = useDimensions(
    width,
    height,
    partialMargin,
  );
  
  const { path, getFillColor, getBorderWidth, getBorderColor } = useGeoMap({
    width,
    height,
    projectionType,
    projectionScale,
    projectionTranslation,
    projectionRotation,
    fillColor,
    borderWidth,
    borderColor,
    features,
    fitProjection,
  });

  const theme = useTheme();

  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  
  const handleClick = useCallback(
    (feature, event) => isInteractive && onClick && onClick(feature, event),
    [isInteractive, onClick],
  );
  
  const handleMouseEnter = useCallback(
    (feature, event) =>
      isInteractive &&
      Tooltip &&
      showTooltipFromEvent(<Tooltip feature={feature} />, event),
    [isInteractive, showTooltipFromEvent, Tooltip],
  );
  
  const handleMouseMove = useCallback(
    (feature, event) =>
      isInteractive &&
      Tooltip &&
      showTooltipFromEvent(<Tooltip feature={feature} />, event),
    [isInteractive, showTooltipFromEvent, Tooltip],
  );
  
  const handleMouseLeave = useCallback(() => isInteractive && hideTooltip(), [
    isInteractive,
    hideTooltip,
  ]);

  // Ensure features is an array
  const safeFeatures = Array.isArray(features) ? features : [];

  return (
    <SvgWrapper
      width={outerWidth}
      height={outerHeight}
      margin={margin}
      theme={theme}>
      {layers.map((layer, i) => {
        if (layer === 'features') {
          return (
            <Fragment key="features">
              {safeFeatures.map((feature, index) => (
                <GeoMapFeature
                  key={feature.id || feature.properties?.id || `feature-${index}`}
                  feature={feature}
                  path={path}
                  fillColor={getFillColor(feature)}
                  borderWidth={getBorderWidth(feature)}
                  borderColor={getBorderColor(feature)}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                />
              ))}
            </Fragment>
          );
        }

        // eslint-disable-next-line react/no-array-index-key
        return <Fragment key={i}>{layer(props)}</Fragment>;
      })}
    </SvgWrapper>
  );
});

GeoMap.displayName = 'GeoMap';
GeoMap.propTypes = GeoMapPropTypes;

export default withContainer(GeoMap);