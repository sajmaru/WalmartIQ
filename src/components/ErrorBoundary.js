// src/components/ErrorBoundary.js
import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
          padding={3}
        >
          <Card>
            <Box padding={4} textAlign="center" maxWidth={600}>
              <Typography variant="h5" color="error" gutterBottom>
                🚨 Something went wrong
              </Typography>
              <Typography variant="body1" gutterBottom>
                There was an error loading this component. This is likely due to missing map data or configuration issues.
              </Typography>
              {process.env.NODE_ENV === 'development' && (
                <Box marginTop={2} textAlign="left">
                  <Typography variant="caption" component="pre" style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 8, 
                    borderRadius: 4,
                    overflow: 'auto',
                    maxHeight: 200
                  }}>
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              )}
              <Box marginTop={2}>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;