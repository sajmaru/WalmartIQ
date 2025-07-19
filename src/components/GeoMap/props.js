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
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['Feature']).isRequired,
      properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      geometry: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    }),
  ).isRequired,

  projectionType: PropTypes.oneOf(Object.keys(projectionById)).isRequired,
  projectionScale: PropTypes.number.isRequired,
  projectionTranslation: PropTypes.arrayOf(PropTypes.number).isRequired,
  projectionRotation: PropTypes.arrayOf(PropTypes.number).isRequired,
  fitProjection: PropTypes.bool,

  fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  borderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
    .isRequired,
  borderColor: inheritedColorPropType.isRequired,

  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.any,

  layers: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.oneOf(['graticule', 'features']),
      PropTypes.func,
    ]),
  ).isRequired,
};

export const GeoMapPropTypes = {
  ...commonPropTypes,
};

const commonDefaultProps = {
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
