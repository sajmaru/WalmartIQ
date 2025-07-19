import React, { useState, createContext } from 'react';

const MapContext = createContext();

const MapProvider = ({ children }) => {
  const [cachedMaps, setCachedMaps] = useState({});

  return (
    <MapContext.Provider value={{ cachedMaps, setCachedMaps }}>
      {children}
    </MapContext.Provider>
  );
};

export { MapContext, MapProvider };
