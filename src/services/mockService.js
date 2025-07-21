// src/services/mockService.js - Updated for Sales Data
import * as mockData from '../mockData';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async get(url) {
    await delay(200);
    
    // Let map files load normally - DON'T intercept them
    if (url.includes('/maps/')) {
      throw new Error('Use real fetch for maps');
    }
    
    // Handle API endpoints - Updated for Sales
    if (url.includes('/api/dashboard/getYear')) return mockData.MOCK_LATEST_YEAR;
    if (url.includes('/api/dashboard/sbuCategory')) return mockData.MOCK_SBU_CATEGORIES;
    if (url.includes('/api/dashboard/sbuSummary')) return mockData.MOCK_TOP_SBUS;
    if (url.includes('/api/dashboard/mapSummary')) return mockData.MOCK_MAP_SUMMARY;
    if (url.includes('/api/dashboard/sbuMap')) return mockData.MOCK_SBU_MAP_DATA;
    if (url.includes('/api/dashboard/getSalesData')) return mockData.MOCK_SALES_TABLE;
    if (url.includes('/api/dashboard/b2bwholesale')) return mockData.MOCK_B2B_WHOLESALE;
    if (url.includes('/api/dashboard/checkData')) return mockData.MOCK_CHECK_DATA;
    if (url.includes('/api/data/getSalesVsMarket')) return mockData.MOCK_SBU_VS_MARKET;
    
    // Legacy crop endpoints redirected to SBU equivalents
    if (url.includes('/api/dashboard/cropCategory')) return mockData.MOCK_SBU_CATEGORIES;
    if (url.includes('/api/dashboard/cropSummary')) return mockData.MOCK_TOP_SBUS;
    if (url.includes('/api/dashboard/cropMap')) return mockData.MOCK_SBU_MAP_DATA;
    if (url.includes('/api/dashboard/getCropData')) return mockData.MOCK_SALES_TABLE;
    if (url.includes('/api/dashboard/importexport')) return mockData.MOCK_B2B_WHOLESALE;
    if (url.includes('/api/data/getCropVsWeather')) return mockData.MOCK_SBU_VS_MARKET;
    
    // Weather APIs (unchanged)
    if (url.includes('/api/weather/getWeatherData') && !url.includes('Total') && !url.includes('Card') && !url.includes('Table')) {
      return mockData.MOCK_WEATHER_DATA;
    }
    if (url.includes('/api/weather/getWeatherDataCard')) return mockData.MOCK_WEATHER_SUMMARY;
    if (url.includes('/api/weather/getWeatherTable')) return mockData.MOCK_WEATHER_TABLE;
    if (url.includes('/api/weather/getWeatherDataTotal')) {
      return [{ years: [{ year: 2023, series: [62.1, 65.3, 68.9, 72.1, 75.2, 79.8, 82.4, 81.9, 78.1, 73.3, 66.8, 63.4] }] }];
    }
    if (url.includes('/api/weather/checkData')) return mockData.MOCK_CHECK_DATA;
    
    // Weather indices (unchanged)
    if (url.includes('/api/pasm/getPASMData') || url.includes('/api/ndvi/getNDVIData') || url.includes('/api/ndwi/getNDWIData')) {
      return mockData.MOCK_WEATHER_DATA;
    }
    if (url.includes('/api/pasm/getPASMTable') || url.includes('/api/ndvi/getNDVITable') || url.includes('/api/ndwi/getNDWITable')) {
      return mockData.MOCK_WEATHER_TABLE;
    }
    
    // Warehouse APIs (unchanged)
    if (url.includes('/api/storage/getStorageSummary')) return mockData.MOCK_WAREHOUSE_SUMMARY;
    if (url.includes('/api/storage/getStorageTotal')) return mockData.MOCK_WAREHOUSE_TOTALS;
    if (url.includes('/api/storage/getStorageData')) return mockData.MOCK_WAREHOUSE_TABLE;
    if (url.includes('/api/storage/checkData')) return mockData.MOCK_CHECK_DATA;
    
    // Pricing APIs (updated from rates)
    if (url.includes('/api/pricing/pricingSummary')) return mockData.MOCK_PRICING_SUMMARY;
    if (url.includes('/api/pricing/getCodes')) return mockData.MOCK_PRICING_CODES;
    if (url.includes('/api/pricing/getTrends')) return mockData.MOCK_PRICING_TRENDS;
    
    // Legacy rates APIs redirected to pricing
    if (url.includes('/api/rates/ratesSummary')) return mockData.MOCK_PRICING_SUMMARY;
    if (url.includes('/api/rates/getCodes')) return mockData.MOCK_PRICING_CODES;
    if (url.includes('/api/rates/getTrends')) return mockData.MOCK_PRICING_TRENDS;
    
    // PDF Directory (unchanged)
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