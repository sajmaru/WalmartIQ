import React, { useState, useCallback, useMemo } from 'react';
import {
  Toolbar,
  Typography,
  Paper,
  Table,
  TableHead,
  TableSortLabel,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import useSWR from 'swr';
import csvDownload from 'json-to-csv-export';
import AnimatedEnter from '../../components/AnimatedEnter';
import useRouting from '../../routes/useRouting';
import useConstants from '../../hooks/useConstants';
import {
  API_HOST_URL,
  STATE_NAMES,
  INDIA_STATE_CODE,
  MONTH_NAMES,
  WEATHER_INDICES,
  WEATHER_INDICES_UNITS,
} from '../../constants';
import { readableNumber, titleCase } from '../../helpers';

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

const WarehouseTable = ({ on }) => {
  const { LATEST_YEAR } = useConstants();
  const { stateCode = INDIA_STATE_CODE, year = LATEST_YEAR } = useRouting();
  const { data: values } = useSWR(
    `${API_HOST_URL}api/${on}/get${on.toUpperCase()}Table?stateCode=${stateCode}&year=${year}`,
  );

  const headCells = useMemo(
    () => [
      {
        id: stateCode === INDIA_STATE_CODE ? 'stateCode' : 'districtCode',
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

  return (
    <AnimatedEnter>
      <Paper variant="outlined">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            {WEATHER_INDICES[on]} for {STATE_NAMES[stateCode]}
          </Typography>
          <Tooltip title="Download">
            <IconButton
              onClick={() =>
                csvDownload(
                  values.map(
                    ({
                      year: thatYear,
                      month,
                      stateCode: thatStateCode,
                      districtCode,
                      ...params
                    }) => ({
                      year: thatYear,
                      month: MONTH_NAMES[month - 1],
                      state: STATE_NAMES[thatStateCode],
                      ...(stateCode !== INDIA_STATE_CODE && {
                        district: titleCase(districtCode.split('-')[1]),
                      }),
                      value: params[on],
                    }),
                  ),
                  `Weather ${STATE_NAMES[stateCode]}.csv`,
                )
              }>
              <CloudDownload />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === headCell.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}>
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableHead>
            {stableSort(values, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                ({
                  year: thatYear,
                  month,
                  stateCode: thatStateCode,
                  districtCode,
                  ...params
                }) => (
                  <TableRow>
                    <TableCell>
                      {stateCode === INDIA_STATE_CODE
                        ? STATE_NAMES[thatStateCode]
                        : titleCase(districtCode.split('-')[1])}
                    </TableCell>
                    <TableCell>{thatYear}</TableCell>
                    <TableCell>{MONTH_NAMES[month - 1]}</TableCell>
                    <TableCell>{readableNumber(params[on])}</TableCell>
                  </TableRow>
                ),
              )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 15, 25]}
          component="div"
          count={values.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </AnimatedEnter>
  );
};
export default WarehouseTable;
