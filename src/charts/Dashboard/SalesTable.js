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
  ALL_SBUS_CODE,
  API_HOST_URL,
  SBU_NAMES,
  DEPT_NAMES,
  STATE_NAMES,
  USA_STATE_CODE,
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

const SalesTable = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    stateCode = USA_STATE_CODE,
    year = LATEST_YEAR,
    sbuCode = ALL_SBUS_CODE,
    deptCode,
  } = useRouting();

  const { data: values = [] } = useSWR(
    `${API_HOST_URL}api/dashboard/getSalesData?stateCode=${stateCode}&year=${year}&sbuCode=${sbuCode}&deptCode=${deptCode}`,
    {
      fallbackData: [],
    },
  );

  const headCells = useMemo(
    () => [
      {
        id: stateCode === USA_STATE_CODE ? 'stateCode' : 'districtCode',
        label: 'Location',
      },
      { id: 'year', label: 'Year' },
      { id: 'sbu', label: 'SBU' },
      { id: 'dept', label: 'Department' },
      {
        id: 'value',
        label: `${year === LATEST_YEAR ? 'Projected ' : ''}Value ($M)`,
        numeric: true,
      },
      {
        id: 'yoyGrowthPercent',
        label: 'YoY% Growth',
        numeric: true,
      },
      {
        id: 'yoyGrowthDollar',
        label: 'YoY $ Growth ($M)',
        numeric: true,
      },
    ],
    [stateCode, year, LATEST_YEAR],
  );

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('value');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

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

  // Helper function to format percentage
  const formatPercentage = useCallback((value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`;
  }, []);

  // Helper function to format dollar amount
  const formatDollarAmount = useCallback((value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const millions = numValue / 1000000;
    return `${millions >= 0 ? '+' : ''}$${millions.toFixed(1)}M`;
  }, []);

  return (
    <AnimatedEnter>
      <Paper variant="outlined">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Sales {year === LATEST_YEAR ? 'Projections' : 'Performance'} for{' '}
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
                    padding="normal"
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
                        stateCode: thatStateCode,
                        sbuCode: thatSbuCode,
                        deptCode: thatDeptCode,
                        districtCode,
                        value,
                        yoyGrowthPercent,
                        yoyGrowthDollar,
                      },
                      index,
                    ) => (
                      <TableRow
                        key={`sales-${thatStateCode}-${thatSbuCode}-${index}`}>
                        <TableCell>
                          {getLocationName(thatStateCode, districtCode)}
                        </TableCell>
                        <TableCell>{year}</TableCell>
                        <TableCell>
                          {SBU_NAMES[thatSbuCode] || thatSbuCode}
                        </TableCell>
                        <TableCell>
                          {DEPT_NAMES[thatDeptCode] || thatDeptCode || 'All Depts'}
                        </TableCell>
                        <TableCell align="right">
                          ${readableNumber(value / 1000000)}M
                        </TableCell>
                        <TableCell 
                          align="right"
                          style={{
                            color: yoyGrowthPercent >= 0 ? '#4CAF50' : '#F44336'
                          }}>
                          {formatPercentage(yoyGrowthPercent)}
                        </TableCell>
                        <TableCell 
                          align="right"
                          style={{
                            color: yoyGrowthDollar >= 0 ? '#4CAF50' : '#F44336'
                          }}>
                          {formatDollarAmount(yoyGrowthDollar)}
                        </TableCell>
                      </TableRow>
                    ),
                  )
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No sales data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 10, 25]}
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

export default SalesTable;