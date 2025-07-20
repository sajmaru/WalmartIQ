import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import useConstants from '../hooks/useConstants';
import { INDIA_STATE_CODE, ALL_CROPS_CODE } from '../constants';

const useRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { LATEST_YEAR } = useConstants();

  const getPath = useCallback(
    (
      {
        stateCode = INDIA_STATE_CODE,
        cropCode = ALL_CROPS_CODE,
        year = LATEST_YEAR,
      },
      page = '',
    ) => {
      let path = page;
      if (year !== LATEST_YEAR) path += `/year/${year}`;
      if (stateCode !== INDIA_STATE_CODE) path += `/state/${stateCode}`;
      if (cropCode !== ALL_CROPS_CODE) path += `/crop/${cropCode}`;
      return path;
    },
    [LATEST_YEAR],
  );

  const goTo = useCallback(
    (newParams, page = '') => {
      const newPath = getPath(newParams, page);
      // Only navigate if the path is actually different
      if (newPath !== location.pathname) {
        navigate(newPath);
      }
    },
    [navigate, location.pathname, getPath],
  );

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      location,
      goTo,
      ...params,
    }),
    [location.pathname, location.search, goTo, params], // Only depend on pathname and search, not entire location object
  );

  return value;
};

export default useRouting;