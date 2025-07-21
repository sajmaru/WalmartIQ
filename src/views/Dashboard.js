import { MenuItem } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import CategorySummary from '../components/CategorySummary';
import SbuMapSummary from '../components/SbuMapSummary';
import Header from '../components/Header';
import B2BWholesaleSummary from '../components/B2BWholesaleSummary';
import MapSummary from '../components/MapSummary';
import Select from '../components/MinimalSelect';
import NoData from '../components/NoData';
import SalesxMarket from '../components/SalesxMarket';
import SuspenseProgress from '../components/SuspenseProgress';
import TopSbuSummary from '../components/TopSbuSummary';
import useConstants from '../hooks/useConstants';
import useInput from '../hooks/useInput';
import useRouting from '../routes/useRouting';

import {
  ALL_SBUS_CODE,
  ALL_DEPTS_CODE,
  API_HOST_URL,
  SBU_NAMES_ARRAY,
  DEPT_NAMES_ARRAY,
  STATE_NAMES_ARRAY,
  UNASSIGNED_SBU_CODE,
  UNASSIGNED_STATE_CODE,
  USA_STATE_CODE,
  SBU_DEPARTMENTS,
} from '../constants';

import { range } from '../helpers';

const dropdownStates = STATE_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_STATE_CODE && code !== USA_STATE_CODE,
);

const dropdownSBUs = SBU_NAMES_ARRAY.filter(
  ({ code }) => code !== UNASSIGNED_SBU_CODE && code !== ALL_SBUS_CODE,
);

const Dashboard = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    goTo,
    stateCode = USA_STATE_CODE,
    sbuCode = ALL_SBUS_CODE,
    deptCode = ALL_DEPTS_CODE,
    year = LATEST_YEAR,
  } = useRouting();

  // Memoize the dropdown years to prevent recalculation
  const dropdownYears = useMemo(
    () => Array.from(range(LATEST_YEAR - 10, LATEST_YEAR)).reverse(),
    [LATEST_YEAR],
  );

  const state = useInput(stateCode || USA_STATE_CODE);
  const sbu = useInput(sbuCode || ALL_SBUS_CODE);
  const dept = useInput(deptCode || ALL_DEPTS_CODE);
  const selectedYear = useInput(year || LATEST_YEAR);

  // Get available departments for selected SBU
  const availableDepts = useMemo(() => {
    if (!sbu.value || sbu.value === ALL_SBUS_CODE) {
      return [];
    }
    
    // Find the SBU name from the code
    const sbuName = SBU_NAMES_ARRAY.find(({ code }) => code === sbu.value)?.name;
    if (!sbuName || !SBU_DEPARTMENTS[sbuName]) {
      return [];
    }

    return SBU_DEPARTMENTS[sbuName].map((deptName, index) => ({
      code: `${sbu.value}_${index + 1}`, // Generate dept codes
      name: deptName,
    }));
  }, [sbu.value]);

  // Handle dropdown changes with immediate navigation
  const handleStateChange = useCallback(
    (event) => {
      const newStateCode = event.target.value;
      state.setValue(newStateCode);
      goTo({
        stateCode: newStateCode,
        sbuCode: sbu.value,
        deptCode: dept.value,
        year: selectedYear.value,
      });
    },
    [state, sbu.value, dept.value, selectedYear.value, goTo],
  );

  const handleSbuChange = useCallback(
    (event) => {
      const newSbuCode = event.target.value;
      sbu.setValue(newSbuCode);
      
      // Reset department when SBU changes
      dept.setValue(ALL_DEPTS_CODE);
      
      goTo({
        stateCode: state.value,
        sbuCode: newSbuCode,
        deptCode: ALL_DEPTS_CODE,
        year: selectedYear.value,
      });
    },
    [sbu, dept, state.value, selectedYear.value, goTo],
  );

  const handleDeptChange = useCallback(
    (event) => {
      const newDeptCode = event.target.value;
      dept.setValue(newDeptCode);
      goTo({
        stateCode: state.value,
        sbuCode: sbu.value,
        deptCode: newDeptCode,
        year: selectedYear.value,
      });
    },
    [dept, state.value, sbu.value, selectedYear.value, goTo],
  );

  const handleYearChange = useCallback(
    (event) => {
      const newYear = event.target.value;
      selectedYear.setValue(newYear);
      goTo({
        stateCode: state.value,
        sbuCode: sbu.value,
        deptCode: dept.value,
        year: newYear,
      });
    },
    [selectedYear, state.value, sbu.value, dept.value, goTo],
  );

  // Sync input values when route parameters change
  useEffect(() => {
    const safeStateCode = stateCode || USA_STATE_CODE;
    const safeSbuCode = sbuCode || ALL_SBUS_CODE;
    const safeDeptCode = deptCode || ALL_DEPTS_CODE;
    const safeYear = year || LATEST_YEAR;

    if (state.value !== safeStateCode) {
      state.setValue(safeStateCode);
    }
    if (sbu.value !== safeSbuCode) {
      sbu.setValue(safeSbuCode);
    }
    if (dept.value !== safeDeptCode) {
      dept.setValue(safeDeptCode);
    }
    if (selectedYear.value !== safeYear) {
      selectedYear.setValue(safeYear);
    }
  }, [stateCode, sbuCode, deptCode, year, state, sbu, dept, selectedYear, LATEST_YEAR]);

  return (
    <>
      <AnimatedEnter>
        <Header
          large
          title={`${year === LATEST_YEAR ? 'Current' : 'Historic'} Sales Dashboard`}
          actions={
            <>
              <Select
                id="sbu-select"
                value={sbu.value || ALL_SBUS_CODE}
                onChange={handleSbuChange}
                displayEmpty>
                <MenuItem key={ALL_SBUS_CODE} value={ALL_SBUS_CODE}>
                  All SBUs
                </MenuItem>
                {dropdownSBUs.map(({ name, code }) => (
                  <MenuItem value={code} key={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              
              {/* Department dropdown - only show if SBU is selected */}
              {sbu.value && sbu.value !== ALL_SBUS_CODE && (
                <Select
                  id="dept-select"
                  value={dept.value || ALL_DEPTS_CODE}
                  onChange={handleDeptChange}
                  displayEmpty>
                  <MenuItem key={ALL_DEPTS_CODE} value={ALL_DEPTS_CODE}>
                    All Departments
                  </MenuItem>
                  {availableDepts.map(({ name, code }) => (
                    <MenuItem value={code} key={code}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              
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
            key={`${sbuCode}-${deptCode}-${stateCode}-${year}`}
            sbuCode={sbuCode}
            deptCode={deptCode}
            stateCode={stateCode}
            year={year}
          />
        </SuspenseProgress>
      </AnimatedEnter>
    </>
  );
};

// Memoize the dashboard content to prevent unnecessary re-renders
const DashboardContent = React.memo(({ sbuCode, deptCode, stateCode, year }) => {
  const { LATEST_YEAR } = useConstants();
  const {
    data: { data: dataAvailable } = { data: true }, // Default fallback
    error,
  } = useSWR(
    `${API_HOST_URL}api/dashboard/checkData?stateCode=${stateCode}&sbuCode=${sbuCode}&deptCode=${deptCode}&year=${year}`,
    {
      fallbackData: { data: true },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  if (!dataAvailable) return <NoData />;

  return sbuCode === ALL_SBUS_CODE ? (
    <>
      <MapSummary key={`map-${stateCode}-${year}`} />
      <CategorySummary key={`category-${stateCode}-${year}`} />
      <TopSbuSummary key={`sbus-${stateCode}-${year}`} />
      {stateCode === USA_STATE_CODE && year === LATEST_YEAR && (
        <B2BWholesaleSummary key={`b2b-${year}`} />
      )}
    </>
  ) : (
    <>
      <SbuMapSummary key={`sbu-map-${stateCode}-${sbuCode}-${deptCode}-${year}`} />
      <SalesxMarket
        key={`sales-market-${stateCode}-${sbuCode}-${deptCode}-${year}`}
      />
    </>
  );
});

DashboardContent.displayName = 'DashboardContent';

export default Dashboard;