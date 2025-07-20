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
  projectionType = 'mercator',
  projectionScale = 100,
  projectionTranslation = [0.5, 0.5],
  projectionRotation = [0, 0, 0],
  fillColor = '#dddddd',
  borderWidth = 2,
  borderColor = '#404040',
  features = [],
  fitProjection = true,
}) => {
  const projection = useMemo(() => {
    // Add error handling for projection type
    const projectionFn = projectionById[projectionType];
    if (!projectionFn) {
      console.warn(`Unknown projection type: ${projectionType}, falling back to mercator`);
    }
    
    const selectedProjection = (projectionById[projectionType] || geoMercator)()
      .scale(projectionScale)
      .translate([
        width * projectionTranslation[0],
        height * projectionTranslation[1],
      ])
      .rotate(projectionRotation);

    if (fitProjection && selectedProjection.fitSize && features.length > 0) {
      selectedProjection.fitSize([width, height], {
        type: 'FeatureCollection',
        features,
      });
    }

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

  const getBorderWidth = useMemo(() => makeGetter(borderWidth, 2), [
    borderWidth,
  ]);
  const getBorderColor = useMemo(() => makeGetter(borderColor, '#404040'), [
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