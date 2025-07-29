// src/components/ResidualExplanationCards.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { readableNumber } from '../helpers';

const ResidualExplanationCards = ({ 
  selectedPoint, 
  explanation, 
  year, 
  sbu,
  isVisible 
}) => {
  const theme = useTheme();
  
  if (!explanation) return null;

  const { residual, reasons, impact, confidence } = explanation;
  
  const isPositive = impact === 'positive';
  const impactColor = isPositive ? theme.palette.success.main : theme.palette.error.main;
  const impactIcon = isPositive ? <TrendingUp /> : <TrendingDown />;
  const impactBg = alpha(impactColor, 0.1);

  const confidenceColor = confidence >= 0.9 
    ? theme.palette.success.main 
    : confidence >= 0.8 
      ? theme.palette.warning.main 
      : theme.palette.error.main;

  return (
    <Collapse in={isVisible} timeout={300}>
      <Box sx={{ mt: 3 }}>
        <Card 
          variant="outlined" 
          sx={{ 
            borderColor: impactColor,
            backgroundColor: impactBg,
            boxShadow: `0 4px 12px ${alpha(impactColor, 0.15)}`
          }}
        >
          <CardContent>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: impactColor,
                mr: 2 
              }}>
                {impactIcon}
                <Typography 
                  variant="h6" 
                  sx={{ ml: 1, fontWeight: 600 }}
                >
                  Residual Analysis: {year}
                </Typography>
              </Box>
              <Chip
                icon={<Analytics />}
                label={`${isPositive ? '+' : ''}$${readableNumber(Math.abs(residual))}`}
                color={isPositive ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* SBU and Confidence */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={`${sbu} Category`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={confidence >= 0.9 ? <CheckCircle /> : <Warning />}
                label={`${Math.round(confidence * 100)}% Confidence`}
                size="small"
                sx={{ 
                  backgroundColor: alpha(confidenceColor, 0.1),
                  color: confidenceColor,
                  borderColor: confidenceColor
                }}
              />
            </Box>

            {/* Explanation Reasons */}
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.secondary }}
            >
              Key Contributing Factors:
            </Typography>
            
            <List dense sx={{ pt: 0 }}>
              {reasons.map((reason, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: impactColor
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={reason}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { lineHeight: 1.4 }
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Impact Summary */}
            <Box 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                borderRadius: 1,
                backgroundColor: alpha(impactColor, 0.05),
                border: `1px solid ${alpha(impactColor, 0.2)}`
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: impactColor }}>
                IMPACT SUMMARY
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                The actual GMV {isPositive ? 'exceeded' : 'fell short of'} forecast by{' '}
                <strong>${readableNumber(Math.abs(residual))}</strong>, representing a{' '}
                <strong>{Math.abs((residual / (explanation.baselineForecast || 100000000)) * 100).toFixed(1)}%</strong>{' '}
                variance from expected performance.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Collapse>
  );
};

export default ResidualExplanationCards;