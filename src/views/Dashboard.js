import React, { useEffect, useMemo } from 'react';
import { MenuItem } from '@material-ui/core';
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
import useContants from '../hooks/useConstants';
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
  const { LATEST_YEAR } = useContants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    cropCode = ALL_CROPS_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  const dropdownYears = useMemo(
    () => Array.from(range(LATEST_YEAR - 10, LATEST_YEAR)).reverse(),
    [LATEST_YEAR],
  );

  const state = useInput(stateCode);
  const crop = useInput(cropCode);
  const selectedYear = useInput(year);

  useEffect(() => {
    goTo({
      stateCode: state.value,
      cropCode: crop.value,
      year: selectedYear.value,
    });
  }, [state.value, crop.value, selectedYear.value, goTo]);

  return (
    <>
      <AnimatedEnter>
        <Header
          large
          title={`${year === LATEST_YEAR ? 'Predicted' : 'Historic'} Dashboard`}
          actions={
            <>
              <Select {...crop.bind}>
                <MenuItem value={ALL_CROPS_CODE}>All Crops</MenuItem>
                {dropdownCrops.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select {...state.bind}>
                <MenuItem value={INDIA_STATE_CODE}>All States</MenuItem>
                {dropdownStates.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select {...selectedYear.bind}>
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
          <DashboardContent {...{ cropCode, stateCode, year }} />
        </SuspenseProgress>
      </AnimatedEnter>
    </>
  );
};

const DashboardContent = ({ cropCode, stateCode, year }) => {
  const { LATEST_YEAR } = useContants();
  const {
    data: { data: dataAvailable },
  } = useSWR(
    `${API_HOST_URL}api/dashboard/checkData?stateCode=${stateCode}&cropCode=${cropCode}&year=${year}`,
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
};

export default Dashboard;
