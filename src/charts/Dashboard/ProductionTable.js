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
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import {
  ALL_CROPS_CODE,
  API_HOST_URL,
  CROP_METRICS_NAMES,
  CROP_METRICS_UNITS,
  CROP_NAMES,
  INDIA_STATE_CODE,
  STATE_NAMES,
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

