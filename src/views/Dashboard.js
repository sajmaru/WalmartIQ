import { MenuItem } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import CategorySummary from '../components/CategorySummary';
import CropMapSummary from '../components/CropMapSummary';
import Header from '../components/Header';
import ImportExportSummary from '../components/ImportExportSummary';
import MapSummary from '../components/MapSummary';
import Select from '../components/MinimalSelect';
import NoData from '../components/NoData';
import ProductionxWeather from '../components/ProductionxWeather';
import SuspenseProgress from '../components/SuspenseProgress';
import TopCropSummary from '../components/TopCropSummary';
import useConstants from '../hooks/useConstants';
import useInput from '../hooks/useInput';
import useRouting from '../routes/useRouting';

import {
  ALL_CROPS_CODE,
  API_HOST_URL,
  CROP_NAMES_ARRAY,
  STATE_NAMES_ARRAY,
  UNASSIGNED_CROP_CODE,
  UNASSIGNED_STATE_CODE,
  USA_STATE_CODE,
} from '../constants';

import { range } from '../helpers';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== USA_STATE_CODE,
);

const dropdownCrops = CROP_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_CROP_CODE && code !== ALL_CROPS_CODE,
);

const Dashboard = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = USA_STATE_CODE,
    cropCode = ALL_CROPS_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  // Memoize the dropdown years to prevent recalculation
  const dropdownYears = useMemo(
    () => Array.from(range(LATEST_YEAR - 10, LATEST_YEAR)).reverse(),
    [LATEST_YEAR],
  );

  const state = useInput(stateCode || USA_STATE_CODE);
  const crop = useInput(cropCode || ALL_CROPS_CODE);
  const selectedYear = useInput(year || LATEST_YEAR);

  // Handle dropdown changes with immediate navigation
  const handleStateChange = useCallback(
    (event) => {
      const newStateCode = event.target.value;
      console.log('🏛️ State changed:', stateCode, '→', newStateCode);

      state.setValue(newStateCode);
      goTo({
        stateCode: newStateCode,
        cropCode: crop.value,
        year: selectedYear.value,
      });
    },
    [state, crop.value, selectedYear.value, goTo, stateCode],
  );

  const handleCropChange = useCallback(
    (event) => {
      const newCropCode = event.target.value;
      console.log('🌾 Crop changed:', cropCode, '→', newCropCode);

      crop.setValue(newCropCode);
      goTo({
        stateCode: state.value,
        cropCode: newCropCode,
        year: selectedYear.value,
      });
    },
    [crop, state.value, selectedYear.value, goTo, cropCode],
  );

  const handleYearChange = useCallback(
    (event) => {
      const newYear = event.target.value;
      console.log('📅 Year changed:', year, '→', newYear);

      selectedYear.setValue(newYear);
      goTo({
        stateCode: state.value,
        cropCode: crop.value,
        year: newYear,
      });
    },
    [selectedYear, state.value, crop.value, goTo, year],
  );

  // Sync input values when route parameters change
  useEffect(() => {
    console.log('🔄 Route params changed:', { stateCode, cropCode, year });

    const safeStateCode = stateCode || USA_STATE_CODE;
    const safeCropCode = cropCode || ALL_CROPS_CODE;
    const safeYear = year || LATEST_YEAR;

    if (state.value !== safeStateCode) {
      console.log('🔄 Syncing state value:', state.value, '→', safeStateCode);
      state.setValue(safeStateCode);
    }
    if (crop.value !== safeCropCode) {
      console.log('🔄 Syncing crop value:', crop.value, '→', safeCropCode);
      crop.setValue(safeCropCode);
    }
    if (selectedYear.value !== safeYear) {
      console.log('🔄 Syncing year value:', selectedYear.value, '→', safeYear);
      selectedYear.setValue(safeYear);
    }
  }, [stateCode, cropCode, year, state, crop, selectedYear, LATEST_YEAR]);

  return (
    <>
      <AnimatedEnter>
        <Header
          large
          title={`${year === LATEST_YEAR ? 'Predicted' : 'Historic'} Dashboard`}
          actions={
            <>
              <Select
                id="crop-select"
                value={crop.value || ALL_CROPS_CODE}
                onChange={handleCropChange}
                displayEmpty>
                <MenuItem key={ALL_CROPS_CODE} value={ALL_CROPS_CODE}>
                  All Crops
                </MenuItem>
                {dropdownCrops.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select
                id="state-select"
                value={state.value || USA_STATE_CODE}
                onChange={handleStateChange}
                displayEmpty>
                <MenuItem key={USA_STATE_CODE} value={USA_STATE_CODE}>
                  All States
                </MenuItem>
                {dropdownStates.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select
                id="year-select"
                value={selectedYear.value || LATEST_YEAR}
                onChange={handleYearChange}
                displayEmpty>
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
          <DashboardContent
            key={`${cropCode}-${stateCode}-${year}`} // Force re-render on param change
            cropCode={cropCode}
            stateCode={stateCode}
            year={year}
          />
        </SuspenseProgress>
      </AnimatedEnter>
    </>
  );
};

// Memoize the dashboard content to prevent unnecessary re-renders
const DashboardContent = React.memo(({ cropCode, stateCode, year }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    data: { data: dataAvailable } = { data: true }, // Default fallback
    error,
  } = useSWR(
    `${API_HOST_URL}api/dashboard/checkData?stateCode=${stateCode}&cropCode=${cropCode}&year=${year}`,
    {
      fallbackData: { data: true },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      onError: (err) =>
        console.log('🎭 Using fallback data availability due to:', err.message),
    },
  );

  console.log('📊 DashboardContent render:', {
    cropCode,
    stateCode,
    year,
    dataAvailable,
    isAllCrops: cropCode === ALL_CROPS_CODE,
    isIndiaMap: stateCode === USA_STATE_CODE,
  });

  if (!dataAvailable) return <NoData />;

  return cropCode === ALL_CROPS_CODE ? (
    <>
      <MapSummary key={`map-${stateCode}-${year}`} />
      <CategorySummary key={`category-${stateCode}-${year}`} />
      <TopCropSummary key={`crops-${stateCode}-${year}`} />
      {stateCode === USA_STATE_CODE && year === LATEST_YEAR && (
        <ImportExportSummary key={`trade-${year}`} />
      )}
    </>
  ) : (
    <>
      <CropMapSummary key={`crop-map-${stateCode}-${cropCode}-${year}`} />
      <ProductionxWeather
        key={`production-weather-${stateCode}-${cropCode}-${year}`}
      />
    </>
  );
});

DashboardContent.displayName = 'DashboardContent';

export default Dashboard;
