/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import PropTypes from 'prop-types';
import { inheritedColorPropType } from '@nivo/colors';
import { projectionById } from './hooks';

const commonPropTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(['Feature']).isRequired,
      properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      geometry: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    }),
  ),

  projectionType: PropTypes.oneOf(Object.keys(projectionById)),
  projectionScale: PropTypes.number,
  projectionTranslation: PropTypes.arrayOf(PropTypes.number),
  projectionRotation: PropTypes.arrayOf(PropTypes.number),
  fitProjection: PropTypes.bool,

  fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  borderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  borderColor: inheritedColorPropType,

  isInteractive: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.any,

  layers: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.oneOf(['graticule', 'features']),
      PropTypes.func,
    ]),
  ),
};

export const GeoMapPropTypes = {
  ...commonPropTypes,
};

const commonDefaultProps = {
  features: [],
  projectionType: 'mercator',
  projectionScale: 100,
  projectionTranslation: [0.5, 0.5],
  projectionRotation: [0, 0, 0],
  fitProjection: false,

  fillColor: '#dddddd',
  borderWidth: 0,
  borderColor: '#000000',

  isInteractive: true,
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onMouseMove: () => {},
  onClick: () => {},

  layers: ['features'],
  legends: [],
};

export const GeoMapDefaultProps = {
  ...commonDefaultProps,
};