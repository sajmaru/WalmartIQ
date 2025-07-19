import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Snackbar,
  MenuItem,
} from '@material-ui/core';
import { makeStyles, StylesContext } from '@material-ui/styles';
import { DropzoneArea } from 'material-ui-dropzone';

import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import MinimalSelect from '../components/MinimalSelect';
import useInput from '../hooks/useInput';
import useConstants from '../hooks/useConstants';

import { STATE_NAMES, INDIA_STATE_CODE, API_HOST_URL } from '../constants';
import { range } from '../helpers';

const useStyles = makeStyles((theme) => ({
  UploadContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
  inputStyles: {
    backgroundColor: theme.palette.background.default,
  },
}));

const AdminPanel = () => {
  const { LATEST_YEAR } = useConstants();
  const classes = useStyles();
  const [file, setFile] = useState([]);
  const [accessCode, setAccessCode] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const state = useInput(Object.entries(STATE_NAMES)[1][0]);
  const year = useInput(2021);

  const dropdownYears = useMemo(
    () => Array.from(range(2021, 2023)).reverse(),
    [],
  );

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setOpen(false);
    },
    [setOpen],
  );

  const handleChange = useCallback(
    (event) => {
      setAccessCode(event.target.value);
    },
    [setAccessCode],
  );

  const handleFile = useCallback(
    (uploadFile) => {
      setFile(uploadFile);
    },
    [setFile],
  );

  const handleUpload = useCallback(() => {
    if (accessCode !== '123456') {
      setOpen(true);
      setMessage('Incorrect Access Code');
    } else {
      const formData = new FormData();

      formData.append('file', file[0]);

      fetch(`${API_HOST_URL}api/dashboard/addData`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(() => {
          setOpen(true);
          setMessage(`Data Added Successfully`);
          setFile([]);
        })
        .catch((err) => {
          setOpen(true);
          setMessage(`Internal Server Error`);
          console.log(err);
        });
    }
  }, [file, accessCode]);

  const handleGenerate = useCallback(() => {
    if (accessCode !== '123456') {
      setOpen(true);
      setMessage('Incorrect Access Code');
    } else {
      fetch(
        `${API_HOST_URL}api/dashboard/genData?stateCode=${state.value}&year=${year.value}`,
      )
        .then((res) => res.json())
        .then(() => {
          setOpen(true);
          setMessage(`Data Generated Successfully`);
          setFile([]);
        })
        .catch((err) => {
          setOpen(true);
          setMessage(`Internal Server Error`);
          console.log(err);
        });
    }
  }, [setMessage, year.value, state.value, accessCode]);

  return (
    <AnimatedEnter>
      <Header
        large
        title="Admin"
        actions={
          <TextField
            label="Access Code"
            variant="filled"
            value={accessCode}
            onChange={handleChange}
            margin="dense"
            size="small"
            inputProps={{
              style: {
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              },
            }}
            type="password"
          />
        }
      />
      <Box padding={3} paddingTop={0}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            <Header title="Generate Predictions" />
            <Card variant="outlined">
              <CardContent>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                  spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <MinimalSelect
                      {...state.bind}
                      classes={StylesContext.inputStyles}>
                      {Object.entries(STATE_NAMES)
                        .filter(([val]) => val !== INDIA_STATE_CODE)
                        .map(([value, name]) => (
                          <MenuItem value={value}>{name}</MenuItem>
                        ))}
                    </MinimalSelect>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MinimalSelect
                      {...year.bind}
                      classes={StylesContext.inputStyles}>
                      <MenuItem value={LATEST_YEAR + 3}>
                        {LATEST_YEAR + 3}
                      </MenuItem>
                      {dropdownYears
                        .filter((y) => y !== LATEST_YEAR + 3)
                        .map((yr) => (
                          <MenuItem value={yr}>{yr}</MenuItem>
                        ))}
                    </MinimalSelect>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      disableElevation
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={handleGenerate}>
                      Generate
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
            <Header
              title="Upload Data"
              actions={
                <Button
                  onClick={handleUpload}
                  disableElevation
                  variant="contained"
                  color="primary"
                  disabled={file.length === 0}>
                  Upload
                </Button>
              }
            />
            <DropzoneArea
              acceptedFiles={[
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,.xlsx, .xlsb, .xlsm, .xls,.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
              ]}
              dropzoneText="Drag and drop a file here or click to add"
              filesLimit={1}
              onChange={handleFile}
              onDelete={() => setFile([])}
              onDrop={handleFile}
              dropzoneClass={classes.UploadContainer}
              useChipsForPreview
            />
            <Typography variant="caption" align="right">
              *upload your data in the format provided in the{' '}
              <a href="/sample.csv">sample</a> file
            </Typography>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
        />
      </Box>
    </AnimatedEnter>
  );
};

export default AdminPanel;
