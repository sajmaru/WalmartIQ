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
  geoAlbersUsa,
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
  albersUsa: geoAlbersUsa, // Added for US maps
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
    
    const selectedProjection = (projectionById[projectionType] || geoMercator)();

    // Special handling for albersUsa projection
    if (projectionType === 'albersUsa') {
      // albersUsa is pre-configured and doesn't support scale, translate, or rotate
      // It's specifically designed for the United States
      selectedProjection
        .translate([
          width * projectionTranslation[0],
          height * projectionTranslation[1],
        ]);
      
      // Scale for albersUsa needs to be applied differently
      if (projectionScale !== 100) {
        selectedProjection.scale(projectionScale);
      }
    } else {
      // For all other projections, apply scale, translate, and rotate
      selectedProjection
        .scale(projectionScale)
        .translate([
          width * projectionTranslation[0],
          height * projectionTranslation[1],
        ])
        .rotate(projectionRotation);
    }

    if (fitProjection && selectedProjection.fitSize && features.length > 0) {
      const featureCollection = {
        type: 'FeatureCollection',
        features,
      };
      
      // Special handling for US maps to reduce top/bottom padding
      if (projectionType === 'albersUsa' || features.length > 10) {
        // For US maps, use fitExtent instead of fitSize for better control
        const padding = projectionType === 'albersUsa' ? 10 : 20;
        if (selectedProjection.fitExtent) {
          selectedProjection.fitExtent(
            [[padding, padding], [width - padding, height - padding]], 
            featureCollection
          );
        } else {
          selectedProjection.fitSize([width, height], featureCollection);
        }
      } else {
        // For state maps, use regular fitSize
        selectedProjection.fitSize([width, height], featureCollection);
      }
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