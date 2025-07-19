/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { useMemo } from 'react';
import {
  geoPath,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoGnomonic,
  geoOrthographic,
  geoStereographic,
  geoEqualEarth,
  geoEquirectangular,
  geoMercator,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoGraticule,
} from 'd3-geo';

const makeGetter = (property, defaultValue) => {
  if (typeof property === 'function') return property;
  if (typeof property === 'object')
    return ({ id }) => property[id] || defaultValue;
  return () => property;
};

export const projectionById = {
  azimuthalEqualArea: geoAzimuthalEqualArea,
  azimuthalEquidistant: geoAzimuthalEquidistant,
  gnomonic: geoGnomonic,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,
  equalEarth: geoEqualEarth,
  equirectangular: geoEquirectangular,
  mercator: geoMercator,
  transverseMercator: geoTransverseMercator,
  naturalEarth1: geoNaturalEarth1,
};

export const useGeoMap = ({
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
}) => {
  const projection = useMemo(() => {
    const selectedProjection = projectionById[projectionType]()
      .scale(projectionScale)
      .translate([
        width * projectionTranslation[0],
        height * projectionTranslation[1],
      ])
      .rotate(projectionRotation);

    if (fitProjection && selectedProjection.fitSize)
      selectedProjection.fitSize([width, height], {
        type: 'FeatureCollection',
        features,
      });

    return selectedProjection;
  }, [
    width,
    height,
    projectionType,
    projectionScale,
    projectionTranslation,
    projectionRotation,
    features,
    fitProjection,
  ]);
  const path = useMemo(() => geoPath().projection(projection), [projection]);
  const graticule = useMemo(() => geoGraticule(), []);

  const getBorderWidth = useMemo(() => makeGetter(borderWidth, 0), [
    borderWidth,
  ]);
  const getBorderColor = useMemo(() => makeGetter(borderColor, '#000000'), [
    borderColor,
  ]);
  const getFillColor = useMemo(() => makeGetter(fillColor, '#dddddd'), [
    fillColor,
  ]);

  return {
    projection,
    path,
    graticule,
    getBorderWidth,
    getBorderColor,
    getFillColor,
  };
};
