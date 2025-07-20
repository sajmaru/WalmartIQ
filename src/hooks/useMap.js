// src/hooks/useMap.js - Simplified for real files
import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { feature } from 'topojson-client';
import { MapContext } from '../context/Maps';

import { INDIA_STATE_CODE, MAP_FILES, HOST_URL } from '../constants';

const toFeatures = (geo, districtWise) => {
  console.log('🗺️ Processing geo data:', {
    hasGeo: !!geo,
    hasObjects: !!geo?.objects,
    objectKeys: geo?.objects ? Object.keys(geo.objects) : [],
    districtWise
  });

  if (!geo?.objects) {
    console.warn('No objects in geo data');
    return [];
  }
  
  try {
    // For real map files, use the correct object key
    const objectKey = districtWise ? 'districts' : 'states';
    let geoObject = geo.objects[objectKey];
    
    // If the requested object doesn't exist, use the first available
    if (!geoObject) {
      const availableKeys = Object.keys(geo.objects);
      console.log(`🗺️ ${objectKey} not found, available:`, availableKeys);
      if (availableKeys.length > 0) {
        geoObject = geo.objects[availableKeys[0]];
        console.log(`🗺️ Using: ${availableKeys[0]}`);
      }
    }
    
    if (!geoObject) {
      console.warn('No suitable geo object found');
      return [];
    }
    
    const features = feature(geo, geoObject).features || [];
    console.log(`✅ Extracted ${features.length} features`);
    return features;
  } catch (error) {
    console.error('Error processing geo data:', error);
    return [];
  }
};

const useMap = (stateCode = INDIA_STATE_CODE, districtWise = false) => {
  const { cachedMaps, setCachedMaps } = useContext(MapContext);

  const mapFetcher = useCallback(
    async (url) => {
      console.log('📍 Fetching:', url);
      
      // Check cache
      if (cachedMaps[url]) {
        console.log('📍 Using cached data');
        return toFeatures(cachedMaps[url], districtWise);
      }

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const geo = await response.json();
        console.log('📍 Fetched geo data:', {
          type: geo.type,
          hasObjects: !!geo.objects,
          objectKeys: geo.objects ? Object.keys(geo.objects) : []
        });
        
        // Cache it
        setCachedMaps(prev => ({ ...prev, [url]: geo }));
        
        // Process and return features
        return toFeatures(geo, districtWise);
      } catch (error) {
        console.error('📍 Fetch error:', error);
        throw error;
      }
    },
    [districtWise, cachedMaps, setCachedMaps],
  );

  const mapFile = MAP_FILES[stateCode];
  const url = mapFile ? `${HOST_URL}maps/${mapFile}` : null;
  
  console.log('📍 Map request:', { stateCode, mapFile, url });

  return useSWR(url, mapFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    fallbackData: [], // Always provide empty array as fallback
    onError: (error) => console.error('📍 SWR Error:', error),
    onSuccess: (data) => console.log('📍 SWR Success:', data?.length, 'features')
  });
};

export default useMap;