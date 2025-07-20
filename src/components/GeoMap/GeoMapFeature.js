/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const GeoMapFeature = memo(
  ({
    feature,
    path,
    fillColor,
    borderWidth,
    borderColor,
    onClick = () => {},
    onMouseEnter = () => {},
    onMouseMove = () => {},
    onMouseLeave = () => {},
  }) => {
    const handleClick = (event) => {

      // Prevent event bubbling
      event.stopPropagation();
      
      // Call the onClick handler with the feature
      if (onClick) {
        onClick(feature, event);
      }
    };

    const handleMouseEnter = (event) => {
      if (onMouseEnter) {
        onMouseEnter(feature, event);
      }
    };

    const handleMouseMove = (event) => {
      if (onMouseMove) {
        onMouseMove(feature, event);
      }
    };

    const handleMouseLeave = (event) => {
      if (onMouseLeave) {
        onMouseLeave(feature, event);
      }
    };

    return (
      <path
        key={feature.id}
        fill={fillColor}
        strokeWidth={borderWidth}
        stroke={borderColor}
        strokeLinejoin="bevel"
        d={path(feature)}
        style={{ 
          cursor: 'pointer',
          transition: 'fill 0.2s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-testid={`map-feature-${feature.id}`}
      />
    );
  },
);

GeoMapFeature.propTypes = {
  feature: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Feature']).isRequired,
    properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    geometry: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }).isRequired,
  path: PropTypes.func.isRequired,

  fillColor: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,

  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

GeoMapFeature.displayName = 'GeoMapFeature';

export default GeoMapFeature;