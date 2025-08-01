import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ALL_SBUS_CODE, ALL_DEPTS_CODE, USA_STATE_CODE } from '../constants';
import useConstants from '../hooks/useConstants';

const useRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { LATEST_YEAR } = useConstants();

  const getPath = useCallback(
    (
      {
        stateCode = USA_STATE_CODE,
        sbuCode = ALL_SBUS_CODE,
        deptCode = ALL_DEPTS_CODE,
        year = LATEST_YEAR,
      },
      page = '',
    ) => {
      let path = page;

      // Only add parameters if they differ from defaults
      if (year !== LATEST_YEAR) {
        path += `/year/${year}`;
      }
      if (stateCode !== USA_STATE_CODE) {
        path += `/state/${stateCode}`;
      }
      if (sbuCode !== ALL_SBUS_CODE) {
        path += `/sbu/${sbuCode}`;
      }
      if (deptCode !== ALL_DEPTS_CODE) {
        path += `/dept/${deptCode}`;
      }

      // Ensure we have at least the base path
      return path || '/';
    },
    [LATEST_YEAR],
  );

  const goTo = useCallback(
    (newParams, page = '') => {
      const currentPath = location.pathname;
      const newPath = getPath(newParams, page);

      // Always navigate, even if path seems the same (force refresh)
      navigate(newPath, { replace: false });
    },
    [navigate, location.pathname, getPath],
  );

  // Parse current route parameters with proper defaults
  const currentParams = useMemo(() => {
    const { stateCode, sbuCode, deptCode, year } = params;

    // Ensure we always have valid values, never undefined
    const safeStateCode = stateCode || USA_STATE_CODE;
    const safeSbuCode = sbuCode || ALL_SBUS_CODE;
    const safeDeptCode = deptCode || ALL_DEPTS_CODE;
    const safeYear = year
      ? typeof year === 'string'
        ? parseInt(year, 10)
        : year
      : LATEST_YEAR;

    return {
      stateCode: safeStateCode,
      sbuCode: safeSbuCode,
      deptCode: safeDeptCode,
      year: safeYear,
    };
  }, [params, LATEST_YEAR]);

  // Memoize the return value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      location,
      goTo,
      ...currentParams,
    }),
    [location.pathname, location.search, goTo, currentParams],
  );

  return value;
};

export default useRouting;