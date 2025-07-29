// src/charts/Pricing/PricingInsights.js
import React, { useState } from 'react';
import {
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import useSWR from 'swr';
import AnimatedEnter from '../../components/AnimatedEnter';
import { API_HOST_URL } from '../../constants';
import InteractiveGMVChart from './InteractiveGMVChart';
import PricingSummaryCard from '../../components/PricingSummaryCard';
import ResidualExplanationCards from '../../components/ResidualExplanationCards';

const PricingInsights = () => {
  const theme = useTheme();
  const { data } = useSWR(`${API_HOST_URL}api/pricing/pricingSummary`);
  
  // State for managing selected points and explanations
  const [selectedExplanations, setSelectedExplanations] = useState({});

  const handlePointClick = (sbuIndex, dataIndex, explanation) => {
    const key = `${sbuIndex}-${dataIndex}`;
    setSelectedExplanations(prev => ({
      ...prev,
      [key]: prev[key] ? null : { // Toggle visibility
        ...explanation,
        sbuIndex,
        dataIndex
      }
    }));
  };

  if (!data) return null;

  return (
    <AnimatedEnter>
      <Grid container spacing={3}>
        {data.map(({ sbu, years, actualGMV, forecastGMV, residualExplanations, insights }, index) => {
          const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main
          ];
          
          return (
            <Grid item xs={12} key={`pricing-insight-${sbu}-${index}`}>
              <Card variant="outlined" style={{ overflow: 'visible' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {sbu} - GMV Analysis
                  </Typography>
                  
                  <InteractiveGMVChart
                    actualGMV={actualGMV}
                    forecastGMV={forecastGMV}
                    years={years}
                    residualExplanations={residualExplanations}
                    colors={colors}
                    onPointClick={(dataIndex, explanation) => 
                      handlePointClick(index, dataIndex, explanation)
                    }
                  />
                  
                  {/* Show explanation cards for selected points */}
                  {Object.entries(selectedExplanations).map(([key, explanation]) => {
                    if (!explanation || explanation.sbuIndex !== index) return null;
                    
                    const year = years[explanation.dataIndex];
                    return (
                      <ResidualExplanationCards
                        key={key}
                        selectedPoint={explanation.dataIndex}
                        explanation={explanation}
                        year={year}
                        sbu={sbu}
                        isVisible={true}
                      />
                    );
                  })}
                  
                  <PricingSummaryCard insights={insights} />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </AnimatedEnter>
  );
};

export default PricingInsights;