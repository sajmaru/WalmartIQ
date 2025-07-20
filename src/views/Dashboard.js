import React, { useEffect, useMemo, useCallback } from 'react';
import { MenuItem } from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import Select from '../components/MinimalSelect';
import Header from '../components/Header';
import SuspenseProgress from '../components/SuspenseProgress';
import MapSummary from '../components/MapSummary';
import CategorySummary from '../components/CategorySummary';
import TopCropSummary from '../components/TopCropSummary';
import ImportExportSummary from '../components/ImportExportSummary';
import CropMapSummary from '../components/CropMapSummary';
import ProductionxWeather from '../components/ProductionxWeather';
import NoData from '../components/NoData';
import useInput from '../hooks/useInput';
import useConstants from '../hooks/useConstants';
import useRouting from '../routes/useRouting';

import {
  UNASSIGNED_CROP_CODE,
  ALL_CROPS_CODE,
  CROP_NAMES_ARRAY,
  UNASSIGNED_STATE_CODE,
  INDIA_STATE_CODE,
  STATE_NAMES_ARRAY,
  API_HOST_URL,
} from '../constants';

import { range } from '../helpers';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== INDIA_STATE_CODE,
);

const dropdownCrops = CROP_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_CROP_CODE && code !== ALL_CROPS_CODE,
);

const Dashboard = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    cropCode = ALL_CROPS_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  // Memoize the dropdown years to prevent recalculation
  const dropdownYears = useMemo(
    () => Array.from(range(LATEST_YEAR - 10, LATEST_YEAR)).reverse(),
    [LATEST_YEAR],
  );

  const state = useInput(stateCode);
  const crop = useInput(cropCode);
  const selectedYear = useInput(year);

  // Memoize the goTo callback to prevent unnecessary re-renders
  const handleNavigation = useCallback(() => {
    goTo({
      stateCode: state.value,
      cropCode: crop.value,
      year: selectedYear.value,
    });
  }, [state.value, crop.value, selectedYear.value, goTo]);

  // Only update when values actually change
  useEffect(() => {
    // Add a check to prevent unnecessary navigation
    if (
      state.value !== stateCode ||
      crop.value !== cropCode ||
      selectedYear.value !== year
    ) {
      handleNavigation();
    }
  }, [handleNavigation, stateCode, cropCode, year, state.value, crop.value, selectedYear.value]);

  return (
    <>
      <AnimatedEnter>
        <Header
          large
          title={`${year === LATEST_YEAR ? 'Predicted' : 'Historic'} Dashboard`}
          actions={
            <>
              <Select id="crop-select" {...crop.bind}>
                <MenuItem key={ALL_CROPS_CODE} value={ALL_CROPS_CODE}>All Crops</MenuItem>
                {dropdownCrops.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select id="state-select" {...state.bind}>
                <MenuItem key={INDIA_STATE_CODE} value={INDIA_STATE_CODE}>All States</MenuItem>
                {dropdownStates.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select id="year-select" {...selectedYear.bind}>
                {dropdownYears.map((dropdownYear) => (
                  <MenuItem value={dropdownYear} key={dropdownYear}>
                    {dropdownYear}
                  </MenuItem>
                ))}
              </Select>
            </>
          }
        />
        <SuspenseProgress>
          <DashboardContent cropCode={cropCode} stateCode={stateCode} year={year} />
        </SuspenseProgress>
      </AnimatedEnter>
    </>
  );
};

// Memoize the dashboard content to prevent unnecessary re-renders
const DashboardContent = React.memo(({ cropCode, stateCode, year }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    data: { data: dataAvailable },
  } = useSWR(
    `${API_HOST_URL}api/dashboard/checkData?stateCode=${stateCode}&cropCode=${cropCode}&year=${year}`,
    {
      // Add SWR options to reduce re-fetching
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  if (!dataAvailable) return <NoData />;

  return cropCode === ALL_CROPS_CODE ? (
    <>
      <MapSummary />
      <CategorySummary />
      <TopCropSummary />
      {stateCode === INDIA_STATE_CODE && year === LATEST_YEAR && (
        <ImportExportSummary />
      )}
    </>
  ) : (
    <>
      <CropMapSummary />
      <ProductionxWeather />
    </>
  );
});

export default Dashboard;