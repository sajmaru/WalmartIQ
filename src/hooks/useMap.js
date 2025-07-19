import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { feature } from 'topojson-client';
import { MapContext } from '../context/Maps';

import { INDIA_STATE_CODE, MAP_FILES, HOST_URL } from '../constants';

const toFeatures = (geo, districtWise) =>
  feature(geo, districtWise ? geo.objects.districts : geo.objects.states)
    .features;

const useMap = (stateCode = INDIA_STATE_CODE, districtWise = false) => {
  const { cachedMaps, setCachedMaps } = useContext(MapContext);

  const mapFetcher = useCallback(
    (url, ...args) => {
      if (!!cachedMaps[url]) {
        return toFeatures(cachedMaps[url], districtWise);
      }
      return fetch(url, ...args)
        .then((response) => response.json())
        .then((geo) => {
          setCachedMaps((oldCachedMaps) => ({ ...oldCachedMaps, [url]: geo }));
          return toFeatures(geo, districtWise);
        })
        .catch(console.error);
    },
    [districtWise, cachedMaps, setCachedMaps],
  );
  return useSWR(`${HOST_URL}maps/${MAP_FILES[stateCode]}`, mapFetcher);
};

export default useMap;
