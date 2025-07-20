import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import {
  API_HOST_URL,
  MONTH_NAMES,
  STATE_NAMES,
  USA_STATE_CODE,
  WEATHER_INDICES,
  WEATHER_INDICES_UNITS,
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

const WeatherIndicesTable = ({ on }) => {
  const { LATEST_YEAR } = useConstants();
  const { stateCode = USA_STATE_CODE, year = LATEST_YEAR } = useRouting();

  const { data: values = [] } = useSWR(
    `${API_HOST_URL}api/${on}/get${on.toUpperCase()}Table?stateCode=${stateCode}&year=${year}`,
    {
      fallbackData: [],
      onError: (err) =>
        console.log(
          '🎭 Using fallback weather indices data due to:',
          err.message,
        ),
    },
  );

  const headCells = useMemo(
    () => [
      {
        id: stateCode === USA_STATE_CODE ? 'stateCode' : 'districtCode',
        label: 'Location',
      },
      { id: 'year', label: 'Year' },
      { id: 'month', label: 'Month' },
      {
        id: on,
        label: `${WEATHER_INDICES[on]} (${WEATHER_INDICES_UNITS[on]})`,
      },
    ],
    [stateCode, on],
  );

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // FIX: Add proper pagination handlers
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
  const getLocationName = useCallback(
    (thatStateCode, districtCode) => {
      if (stateCode === USA_STATE_CODE) {
        return STATE_NAMES[thatStateCode] || thatStateCode || 'Unknown';
      } else {
        if (!districtCode) return 'Unknown District';
        if (typeof districtCode !== 'string') return String(districtCode);

        const parts = districtCode.split('-');
        if (parts.length > 1) {
          return titleCase(parts[1]);
        }
        return titleCase(districtCode);
      }
    },
    [stateCode],
  );

  return (
    <AnimatedEnter>
      <Paper variant="outlined">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            {WEATHER_INDICES[on]} for {STATE_NAMES[stateCode] || stateCode}
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
                      <TableRow
                        key={`weather-indices-${thatStateCode}-${month}-${index}`}>
                        <TableCell>
                          {getLocationName(thatStateCode, districtCode)}
                        </TableCell>
                        <TableCell>{thatYear || year}</TableCell>
                        <TableCell>
                          {MONTH_NAMES[month - 1] || `Month ${month}`}
                        </TableCell>
                        <TableCell>{readableNumber(params[on])}</TableCell>
                      </TableRow>
                    ),
                  )
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No weather indices data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* FIX: Add missing onPageChange */}
        <TablePagination
          rowsPerPageOptions={[8, 15, 25]}
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

export default WeatherIndicesTable;

