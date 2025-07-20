// src/services/mockService.js - Don't touch map files
import * as mockData from '../mockData';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async get(url) {
    await delay(200);
    console.log('🎭 Mock API:', url);
    
    // Let map files load normally - DON'T intercept them
    if (url.includes('/maps/')) {
      console.log('📍 Letting real map file load:', url);
      throw new Error('Use real fetch for maps');
    }
    
    // Handle API endpoints only
    if (url.includes('/api/dashboard/getYear')) return mockData.MOCK_LATEST_YEAR;
    if (url.includes('/api/dashboard/cropCategory')) return mockData.MOCK_CROP_CATEGORIES;
    if (url.includes('/api/dashboard/cropSummary')) return mockData.MOCK_TOP_CROPS;
    if (url.includes('/api/dashboard/mapSummary')) return mockData.MOCK_MAP_SUMMARY;
    if (url.includes('/api/dashboard/cropMap')) return mockData.MOCK_CROP_MAP_DATA;
    if (url.includes('/api/dashboard/getCropData')) return mockData.MOCK_PRODUCTION_TABLE;
    if (url.includes('/api/dashboard/importexport')) return mockData.MOCK_IMPORT_EXPORT;
    if (url.includes('/api/dashboard/checkData')) return mockData.MOCK_CHECK_DATA;
    if (url.includes('/api/data/getCropVsWeather')) return mockData.MOCK_CROP_VS_WEATHER;
    
    // Weather APIs
    if (url.includes('/api/weather/getWeatherData') && !url.includes('Total') && !url.includes('Card') && !url.includes('Table')) {
      return mockData.MOCK_WEATHER_DATA;
    }
    if (url.includes('/api/weather/getWeatherDataCard')) return mockData.MOCK_WEATHER_SUMMARY;
    if (url.includes('/api/weather/getWeatherTable')) return mockData.MOCK_WEATHER_TABLE;
    if (url.includes('/api/weather/getWeatherDataTotal')) {
      return [{ years: [{ year: 2023, series: [22.1, 25.3, 28.9, 32.1, 35.2, 29.8, 26.4, 25.9, 27.1, 29.3, 26.8, 23.4] }] }];
    }
    if (url.includes('/api/weather/checkData')) return mockData.MOCK_CHECK_DATA;
    
    // Weather indices
    if (url.includes('/api/pasm/getPASMData') || url.includes('/api/ndvi/getNDVIData') || url.includes('/api/ndwi/getNDWIData')) {
      return mockData.MOCK_WEATHER_DATA;
    }
    if (url.includes('/api/pasm/getPASMTable') || url.includes('/api/ndvi/getNDVITable') || url.includes('/api/ndwi/getNDWITable')) {
      return mockData.MOCK_WEATHER_TABLE;
    }
    
    // Warehouse APIs
    if (url.includes('/api/storage/getStorageSummary')) return mockData.MOCK_WAREHOUSE_SUMMARY;
    if (url.includes('/api/storage/getStorageTotal')) return mockData.MOCK_WAREHOUSE_TOTALS;
    if (url.includes('/api/storage/getStorageData')) return mockData.MOCK_WAREHOUSE_TABLE;
    if (url.includes('/api/storage/checkData')) return mockData.MOCK_CHECK_DATA;
    
    // Rates APIs
    if (url.includes('/api/rates/ratesSummary')) return mockData.MOCK_RATES_SUMMARY;
    if (url.includes('/api/rates/getCodes')) return mockData.MOCK_RATES_CODES;
    if (url.includes('/api/rates/getTrends')) return mockData.MOCK_RATES_TRENDS;
    
    // PDF Directory
    if (url.includes('/api/directory/getDirectoryList')) return mockData.MOCK_PDF_DIRECTORY;
    
    console.warn('🚨 Unhandled mock API:', url);
    return { data: [], message: 'Mock endpoint not found' };
  }
}

export const mockApiService = new MockApiService();

export const mockFetcher = async (url) => {
  try {
    // Always use real fetch for map files
    if (url.includes('/maps/')) {
      console.log('📍 Real fetch for map:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Map fetch failed: ${response.status}`);
      }
      return await response.json();
    }
    
    // Use mock for API calls in development
    if (process.env.NODE_ENV === 'development') {
      return await mockApiService.get(url);
    }
    
    // Production: real fetch for everything
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};