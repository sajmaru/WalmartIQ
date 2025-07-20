import { MenuItem } from '@mui/material';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import Select from '../components/MinimalSelect';
import NoData from '../components/NoData';
import SuspenseProgress from '../components/SuspenseProgress';
import WeatherIndicesSummary from '../components/WeatherIndicesSummary';
import WeatherMapSummary from '../components/WeatherMapSummary';
import useConstants from '../hooks/useConstants';
import useInput from '../hooks/useInput';
import useRouting from '../routes/useRouting';

import WeatherHistory from '../components/WeatherHistory';
import {
  API_HOST_URL,
  STATE_NAMES_ARRAY,
  UNASSIGNED_STATE_CODE,
  USA_STATE_CODE,
} from '../constants';
import { range } from '../helpers';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== USA_STATE_CODE,
);

const WeatherDashboard = () => {
  const { LATEST_YEAR } = useConstants();
  const { goTo, stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();

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
            <Select id="state-select" {...state.bind}>
              <MenuItem key={USA_STATE_CODE} value={USA_STATE_CODE}>
                All States
              </MenuItem>
              {dropdownStates.map(({ name, code }) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Select id="year-select" {...selectedYear.bind}>
              {dropdownYears.map((dropdownYear) => (
                <MenuItem key={dropdownYear} value={dropdownYear}>
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

