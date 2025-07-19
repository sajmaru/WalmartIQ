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
  CROP_NAMES,
  CROP_METRICS_NAMES,
  CROP_METRICS_UNITS,
  ALL_CROPS_CODE,
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

const ProductionTable = () => {
  const { LATEST_YEAR } = useConstants();
  const {
    stateCode = INDIA_STATE_CODE,
    year = LATEST_YEAR,
    cropCode = ALL_CROPS_CODE,
  } = useRouting();
  const { data: values } = useSWR(
    `${API_HOST_URL}api/dashboard/getCropData?stateCode=${stateCode}&year=${year}&cropCode=${cropCode}`,
  );

  const headCells = useMemo(
    () => [
      {
        id: stateCode === INDIA_STATE_CODE ? 'stateCode' : 'districtCode',
        label: 'Location',
      },
      { id: 'year', label: 'Year' },
      { id: 'crop', label: 'Crop' },
      ...Object.entries(CROP_METRICS_NAMES).map(([paramCode, paramName]) => ({
        id: paramCode,
        label: `${year === LATEST_YEAR ? 'Predicted ' : ''}${paramName} (${
          CROP_METRICS_UNITS[paramCode]
        })`,
      })),
    ],
    [stateCode, year, LATEST_YEAR],
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
            Agricultural {year === LATEST_YEAR ? 'Prediction' : 'Data'} for{' '}
            {STATE_NAMES[stateCode]}
          </Typography>
          <Tooltip title="Download">
            <IconButton
              onClick={() =>
                csvDownload(
                  values.map(
                    ({
                      year: thatYear,
                      stateCode: thatStateCode,
                      districtCode,
                      cropCode: thatCropCode,
                      ...params
                    }) => ({
                      state: STATE_NAMES[thatStateCode],
                      ...(stateCode !== INDIA_STATE_CODE && {
                        district: titleCase(districtCode.split('-')[1]),
                      }),
                      crop: CROP_NAMES[thatCropCode],
                      ...params,
                    }),
                  ),
                  `Production ${STATE_NAMES[stateCode]}.csv`,
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
                  stateCode: thatStateCode,
                  cropCode: thatCropCode,
                  districtCode,
                  ...params
                }) => (
                  <TableRow>
                    <TableCell>
                      {stateCode === INDIA_STATE_CODE
                        ? STATE_NAMES[thatStateCode]
                        : titleCase(districtCode.split('-')[1])}
                    </TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell>{CROP_NAMES[thatCropCode]}</TableCell>
                    {Object.values(params).map((value) => (
                      <TableCell>{readableNumber(value)}</TableCell>
                    ))}
                  </TableRow>
                ),
              )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 10, 25]}
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

export default ProductionTable;
