import React, { useState, createContext } from 'react';

const ConstantsContext = createContext();

const ConstantsProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <ConstantsContext.Provider value={{ state, setState }}>
      {children}
    </ConstantsContext.Provider>
  );
};

export { ConstantsContext, ConstantsProvider };
