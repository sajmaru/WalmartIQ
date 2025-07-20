import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  TableBody,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import {
  API_HOST_URL,
  INDIA_STATE_CODE,
  MONTH_NAMES,
  STATE_NAMES,
  WEATHER_PARAMS,
  WEATHER_UNITS,
} from '../../constants';
import { readableNumber, titleCase } from '../../helpers';
import useConstants from '../../hooks/useConstants';
import useRouting from '../../routes/useRouting';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const WeatherTable = () => {
  const { LATEST_YEAR } = useConstants();
  const { stateCode = INDIA_STATE_CODE, year = LATEST_YEAR } = useRouting();
  
  const { data: values = [] } = useSWR(
    `${API_HOST_URL}api/weather/getWeatherTable?stateCode=${stateCode}&year=${year}`,
    {
      fallbackData: [],
      onError: (err) => console.log('🎭 Using fallback weather data due to:', err.message)
    }
  );

  const headCells = useMemo(
    () => [
      {
        id: stateCode === INDIA_STATE_CODE ? 'stateCode' : 'districtCode',
        label: 'Location',
      },
      { id: 'year', label: 'Year' },
      { id: 'month', label: 'Month' },
      ...Object.entries(WEATHER_PARAMS).map(([paramCode, paramName]) => ({
        id: paramCode,
        label: `${year === LATEST_YEAR ? 'Predicted ' : ''}${paramName} (${
          WEATHER_UNITS[paramCode]
        })`,
      })),
    ],
    [stateCode, year, LATEST_YEAR],
  );

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // FIX 1: Add proper onPageChange handler
  const handleChangePage = useCallback((_event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleRequestSort = useCallback(
    (_event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy],
  );

  const createSortHandler = useCallback(
    (property) => (event) => {
      handleRequestSort(event, property);
    },
    [handleRequestSort],
  );

  // Helper function to safely get location name
  const getLocationName = useCallback((thatStateCode, districtCode) => {
    if (stateCode === INDIA_STATE_CODE) {
      return STATE_NAMES[thatStateCode] || thatStateCode || 'Unknown';
    } else {
      // Handle cases where districtCode might be undefined or not in expected format
      if (!districtCode) return 'Unknown District';
      if (typeof districtCode !== 'string') return String(districtCode);
      
      const parts = districtCode.split('-');
      if (parts.length > 1) {
        return titleCase(parts[1]);
      }
      return titleCase(districtCode);
    }
  }, [stateCode]);

  return (
    <AnimatedEnter>
      <Paper variant="outlined">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Weather {year === LATEST_YEAR ? 'Prediction' : 'Data'} for{' '}
            {STATE_NAMES[stateCode] || stateCode}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {values.length > 0 ? (
                stableSort(values, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(
                    (
                      {
                        year: thatYear,
                        month,
                        stateCode: thatStateCode,
                        districtCode,
                        ...params
                      },
                      index,
                    ) => (
                      <TableRow key={`weather-${thatStateCode}-${month}-${index}`}>
                        <TableCell>
                          {getLocationName(thatStateCode, districtCode)}
                        </TableCell>
                        <TableCell>{thatYear || year}</TableCell>
                        <TableCell>{MONTH_NAMES[month - 1] || `Month ${month}`}</TableCell>
                        {/* FIX 2: Add unique keys to mapped TableCell elements */}
                        {Object.entries(params).map(([paramKey, value], paramIndex) => (
                          <TableCell key={`param-${paramKey}-${paramIndex}`}>
                            {readableNumber(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ),
                  )
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No weather data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* FIX 3: Add the missing onPageChange prop */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={values.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </AnimatedEnter>
  );
};

export default WeatherTable;