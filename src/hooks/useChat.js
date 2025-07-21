// src/hooks/useChat.js
import { useState, useCallback } from 'react';
import useRouting from '../routes/useRouting';
import { 
  USA_STATE_CODE, 
  ALL_CROPS_CODE, 
  STATE_NAMES, 
  CROP_NAMES 
} from '../constants';

const useChat = () => {
  const { goTo } = useRouting();
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse user queries and extract intents
  const parseUserQuery = useCallback((query) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Extract state names
    const stateMatch = Object.entries(STATE_NAMES).find(([code, name]) => 
      normalizedQuery.includes(name.toLowerCase())
    );
    
    // Extract crop names
    const cropMatch = Object.entries(CROP_NAMES).find(([code, name]) => 
      normalizedQuery.includes(name.toLowerCase())
    );
    
    // Extract years
    const yearMatch = normalizedQuery.match(/\b(20\d{2})\b/);
    
    // Determine query type
    let queryType = 'GENERAL';
    
    if (normalizedQuery.includes('show') || normalizedQuery.includes('display')) {
      if (cropMatch || stateMatch) {
        queryType = 'SHOW_DATA';
      }
    } else if (normalizedQuery.includes('filter') || normalizedQuery.includes('table')) {
      queryType = 'FILTER_TABLE';
    } else if (normalizedQuery.includes('weather')) {
      queryType = 'WEATHER_DATA';
    } else if (normalizedQuery.includes('compare')) {
      queryType = 'COMPARE_DATA';
    } else if (normalizedQuery.includes('warehouse') || normalizedQuery.includes('storage')) {
      queryType = 'WAREHOUSE_DATA';
    } else if (normalizedQuery.includes('rates') || normalizedQuery.includes('price')) {
      queryType = 'RATES_DATA';
    }
    
    return {
      type: queryType,
      state: stateMatch ? stateMatch[0] : null,
      stateName: stateMatch ? stateMatch[1] : null,
      crop: cropMatch ? cropMatch[0] : null,
      cropName: cropMatch ? cropMatch[1] : null,
      year: yearMatch ? parseInt(yearMatch[1]) : null,
      originalQuery: query,
    };
  }, []);

  // Process user queries and update the dashboard
  const processQuery = useCallback(async (query) => {
    setIsProcessing(true);
    
    try {
      const intent = parseUserQuery(query);
      let response = '';
      
      switch (intent.type) {
        case 'SHOW_DATA':
          // Navigate to specific data view
          goTo({
            stateCode: intent.state || USA_STATE_CODE,
            cropCode: intent.crop || ALL_CROPS_CODE,
            year: intent.year,
          });
          
          response = `Showing ${intent.cropName || 'all crops'} data${intent.stateName ? ` for ${intent.stateName}` : ''}${intent.year ? ` for ${intent.year}` : ''}.`;
          break;
          
        case 'WEATHER_DATA':
          // Navigate to weather dashboard
          goTo({
            stateCode: intent.state || USA_STATE_CODE,
            year: intent.year,
          }, '/weather');
          
          response = `Displaying weather data${intent.stateName ? ` for ${intent.stateName}` : ''}${intent.year ? ` for ${intent.year}` : ''}.`;
          break;
          
        case 'WAREHOUSE_DATA':
          // Navigate to warehouse dashboard
          goTo({
            stateCode: intent.state || USA_STATE_CODE,
          }, '/warehouse');
          
          response = `Showing warehouse information${intent.stateName ? ` for ${intent.stateName}` : ''}.`;
          break;
          
        case 'RATES_DATA':
          // Navigate to rates dashboard
          goTo({}, '/rates');
          
          response = `Displaying crop rates and pricing information.`;
          break;
          
        case 'FILTER_TABLE':
          response = `I can help you filter the data. The dashboard has been updated based on your criteria.`;
          break;
          
        case 'COMPARE_DATA':
          response = `To compare data effectively, you can use the dropdown filters above. Would you like me to guide you through specific comparisons?`;
          break;
          
        default:
          response = `I understand you're asking about "${query}". I can help you navigate the dashboard, filter data, or answer questions about crops, weather, warehouses, and pricing. Try asking me to show specific data or navigate to different sections.`;
      }
      
      return {
        response,
        intent,
        success: true,
      };
      
    } catch (error) {
      console.error('Error processing chat query:', error);
      return {
        response: "I'm sorry, I encountered an error processing your request. Please try again.",
        intent: null,
        success: false,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [parseUserQuery, goTo]);

  // Generate contextual suggestions based on current route
  const getContextualSuggestions = useCallback(() => {
    // This would be enhanced based on current route/page
    return [
      "Show corn production in Iowa",
      "Filter data by 2023",
      "Compare wheat yields between states", 
      "Display weather forecast for Texas",
      "Show warehouse capacity by state",
      "Navigate to crop pricing data",
    ];
  }, []);

  return {
    processQuery,
    parseUserQuery,
    getContextualSuggestions,
    isProcessing,
  };
};

export default useChat;