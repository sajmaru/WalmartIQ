import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../components/AnimatedEnter';
import Header from '../components/Header';
import MinimalSelect from '../components/MinimalSelect';
import useInput from '../hooks/useInput';
import { API_HOST_URL } from '../constants';

const PDFDirectory = () => {
  const { data: values } = useSWR(
    `${API_HOST_URL}api/directory/getDirectoryList`,
  );

  const categoryValues = useMemo(
    () => [...new Set(values.map((value) => value.category))],
    [values],
  );

  const categories = useInput(categoryValues[0]);

  return (
    <AnimatedEnter>
      <Header
        large
        title="PDF Directory"
        actions={
          <MinimalSelect 
            id="category-select"
            {...categories.bind}
          >
            {categoryValues.map((value, index) => (
              <MenuItem key={`category-${index}`} value={value}>
                {value}
              </MenuItem>
            ))}
          </MinimalSelect>
        }
      />
      <Box padding={3}>
        <Grid container spacing={3}>
          {values
            .filter((value) => value.category === categories.value)
            .map((value, index) => (
              <Grid item md={3} sm={4} xs={6} key={`pdf-${index}`}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(
                      `${API_HOST_URL}api/directory/files/${value.filename}`,
                      '_blank',
                    );
                  }}
                >
                  <CardMedia
                    image={`${API_HOST_URL}api/directory/thumbnails/${value.thumbnail}`}
                    title={value.name}
                    style={{ height: 200 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{value.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </AnimatedEnter>
  );
};

export default PDFDirectory;