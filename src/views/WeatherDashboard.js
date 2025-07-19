import React, { useEffect, useMemo } from 'react';
import { MenuItem } from '@material-ui/core';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import Select from '../components/MinimalSelect';
import Header from '../components/Header';
import SuspenseProgress from '../components/SuspenseProgress';
import NoData from '../components/NoData';
import WeatherMapSummary from '../components/WeatherMapSummary';
import WeatherIndicesSummary from '../components/WeatherIndicesSummary';
import useInput from '../hooks/useInput';
import useConstants from '../hooks/useConstants';
import useRouting from '../routes/useRouting';

import {
  UNASSIGNED_STATE_CODE,
  INDIA_STATE_CODE,
  STATE_NAMES_ARRAY,
  API_HOST_URL,
} from '../constants';
import { range } from '../helpers';
import WeatherHistory from '../components/WeatherHistory';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== INDIA_STATE_CODE,
);

const WeatherDashboard = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = INDIA_STATE_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  const dropdownYears = useMemo(
    () => Array.from(range(LATEST_YEAR - 10, LATEST_YEAR)).reverse(),
    [LATEST_YEAR],
  );

  const state = useInput(stateCode);
  const selectedYear = useInput(year);

  useEffect(() => {
    goTo(
      {
        stateCode: state.value,
        year: selectedYear.value,
      },
      '/weather',
    );
  }, [state.value, goTo, selectedYear.value]);

  return (
    <AnimatedEnter>
      <Header
        large
        title={`${year === LATEST_YEAR ? 'Predicted' : 'Historic'} Weather`}
        actions={
          <>
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
        <WeatherDashboardContent stateCode={stateCode} year={year} />
      </SuspenseProgress>
    </AnimatedEnter>
  );
};

const WeatherDashboardContent = ({ stateCode, year }) => {
  const {
    data: { data: dataAvailable },
  } = useSWR(
    `${API_HOST_URL}api/weather/checkData?stateCode=${stateCode}&year=${year}`,
  );

  if (!dataAvailable) return <NoData />;

  return (
    <>
      <WeatherMapSummary />
      <WeatherHistory />
      <WeatherIndicesSummary />
    </>
  );
};

export default WeatherDashboard;
