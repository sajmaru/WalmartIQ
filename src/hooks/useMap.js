// src/hooks/useMap.js - Updated for US states and counties
import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { feature } from 'topojson-client';
import { MapContext } from '../context/Maps';

import { 
  USA_STATE_CODE, 
  MAP_FILES, 
  HOST_URL, 
  FIPS_TO_STATE_CODE,
  STATE_CODE_TO_FIPS,
  US_STATE_FIPS
} from '../constants';

const toFeatures = (geo, stateCode, isCountyLevel) => {
  if (!geo?.objects) {
    console.warn('No objects in geo data');
    return [];
  }
  
  try {
    let geoObject;
    let features;
    
    if (isCountyLevel) {
      // County level processing (existing code)
      geoObject = geo.objects.counties;
      if (!geoObject) {
        console.warn('No counties object found in geo data');
        return [];
      }
      
      const allFeatures = feature(geo, geoObject).features || [];
      const stateFips = STATE_CODE_TO_FIPS[stateCode];
      if (!stateFips) {
        console.warn(`No FIPS code found for state: ${stateCode}`);
        return [];
      }
      
      features = allFeatures.filter(feat => {
        const countyFips = feat.id;
        return countyFips && countyFips.startsWith(stateFips);
      });
      
    } else {
      // US-level map processing
      geoObject = geo.objects.states;
      if (!geoObject) {
        console.warn('No states object found in geo data');
        return [];
      }
      
      const allFeatures = feature(geo, geoObject).features || [];
      
      // Territories to exclude
      const territoriesToExclude = [
        'American Samoa',
        'Commonwealth of the Northern Mariana Islands',
        'Guam', 
        'Puerto Rico',
        'United States Virgin Islands'
      ];
      
      // Filter to only include continental US states
      features = allFeatures.filter(feat => {
        const stateFips = feat.id;
        const stateName = feat.properties?.name;
        
        const isValidState = US_STATE_FIPS.hasOwnProperty(stateFips);
        const isTerritory = territoriesToExclude.includes(stateName);
        
        return isValidState && !isTerritory;
      });
    }
    
    // Add unique IDs and normalize properties
    const featuresWithIds = features.map((feat, index) => {
      if (!feat.id) {
        const baseName = feat.properties?.name || `feature`;
        const uniqueId = `${baseName}_${index}`.replace(/\s+/g, '_').toUpperCase();
        feat = { ...feat, id: uniqueId };
      }
      
      // Normalize properties
      const normalizedProps = { ...feat.properties };
      
      if (isCountyLevel) {
        const countyFips = feat.id;
        const stateFips = countyFips.substring(0, 2);
        const stateCode = FIPS_TO_STATE_CODE[stateFips];
        
        normalizedProps.county = feat.properties.name;
        normalizedProps.st_nm = stateCode;
        normalizedProps.district = feat.properties.name;
        normalizedProps.fips = countyFips;
        normalizedProps.state_fips = stateFips;
        
      } else {
        const stateFips = feat.id;
        const stateCode = FIPS_TO_STATE_CODE[stateFips];
        
        normalizedProps.st_nm = feat.properties.name.toUpperCase();
        normalizedProps.state_code = stateCode;
        normalizedProps.fips = stateFips;
      }
      
      return {
        ...feat,
        properties: normalizedProps
      };
    });
    
    return featuresWithIds;
    
  } catch (error) {
    console.error('Error processing geo data:', error);
    return [];
  }
};

const useMap = (stateCode = USA_STATE_CODE, countyLevel = false) => {
  const { cachedMaps, setCachedMaps } = useContext(MapContext);

  const mapFetcher = useCallback(
    async (url) => {
      
      // Create cache key that includes state for county filtering
      const cacheKey = countyLevel ? `${url}:${stateCode}` : url;
      
      // Check cache
      if (cachedMaps[cacheKey]) {
        return cachedMaps[cacheKey];
      }

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const geo = await response.json();

        
        // Process the features
        const features = toFeatures(geo, stateCode, countyLevel);
        
        // Cache the processed features (not the raw geo data)
        setCachedMaps(prev => ({ ...prev, [cacheKey]: features }));
        
        return features;
        
      } catch (error) {
        console.error('📍 Fetch error:', error);
        throw error;
      }
    },
    [stateCode, countyLevel, cachedMaps, setCachedMaps],
  );

  // Determine which file to load
  const mapFile = MAP_FILES[stateCode];
  const url = mapFile ? `${HOST_URL}maps/${mapFile}` : null;
  


  return useSWR(url, mapFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    fallbackData: [], // Always provide empty array as fallback
    onError: (error) => console.error('📍 SWR Error:', error),
  });
};

export default useMap;