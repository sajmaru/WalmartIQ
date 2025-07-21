export const HOST_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/' 
  : `${window.location.protocol}//${window.location.host}/`;

export const API_HOST_URL = 'https://bd519d3f8f20.ngrok.io/';

export const UNASSIGNED_STATE_CODE = 'UN';
export const USA_STATE_CODE = 'US'; // Equivalent to previous INDIA_STATE_CODE

// FIPS code to state information mapping (Continental US only - 48 states)
export const US_STATE_FIPS = {
  "01": { name: "Alabama", code: "AL" },
  "04": { name: "Arizona", code: "AZ" },
  "05": { name: "Arkansas", code: "AR" },
  "06": { name: "California", code: "CA" },
  "08": { name: "Colorado", code: "CO" },
  "09": { name: "Connecticut", code: "CT" },
  "10": { name: "Delaware", code: "DE" },
  "12": { name: "Florida", code: "FL" },
  "13": { name: "Georgia", code: "GA" },
  "16": { name: "Idaho", code: "ID" },
  "17": { name: "Illinois", code: "IL" },
  "18": { name: "Indiana", code: "IN" },
  "19": { name: "Iowa", code: "IA" },
  "20": { name: "Kansas", code: "KS" },
  "21": { name: "Kentucky", code: "KY" },
  "22": { name: "Louisiana", code: "LA" },
  "23": { name: "Maine", code: "ME" },
  "24": { name: "Maryland", code: "MD" },
  "25": { name: "Massachusetts", code: "MA" },
  "26": { name: "Michigan", code: "MI" },
  "27": { name: "Minnesota", code: "MN" },
  "28": { name: "Mississippi", code: "MS" },
  "29": { name: "Missouri", code: "MO" },
  "30": { name: "Montana", code: "MT" },
  "31": { name: "Nebraska", code: "NE" },
  "32": { name: "Nevada", code: "NV" },
  "33": { name: "New Hampshire", code: "NH" },
  "34": { name: "New Jersey", code: "NJ" },
  "35": { name: "New Mexico", code: "NM" },
  "36": { name: "New York", code: "NY" },
  "37": { name: "North Carolina", code: "NC" },
  "38": { name: "North Dakota", code: "ND" },
  "39": { name: "Ohio", code: "OH" },
  "40": { name: "Oklahoma", code: "OK" },
  "41": { name: "Oregon", code: "OR" },
  "42": { name: "Pennsylvania", code: "PA" },
  "44": { name: "Rhode Island", code: "RI" },
  "45": { name: "South Carolina", code: "SC" },
  "46": { name: "South Dakota", code: "SD" },
  "47": { name: "Tennessee", code: "TN" },
  "48": { name: "Texas", code: "TX" },
  "49": { name: "Utah", code: "UT" },
  "50": { name: "Vermont", code: "VT" },
  "51": { name: "Virginia", code: "VA" },
  "53": { name: "Washington", code: "WA" },
  "54": { name: "West Virginia", code: "WV" },
  "55": { name: "Wisconsin", code: "WI" },
  "56": { name: "Wyoming", code: "WY" }
};

// Excluded states/territories (for reference)
export const US_EXCLUDED_FIPS = {
  "02": { name: "Alaska", code: "AK", reason: "Non-continental" },
  "11": { name: "District of Columbia", code: "DC", reason: "Federal district" },
  "15": { name: "Hawaii", code: "HI", reason: "Non-continental" },
  "60": { name: "American Samoa", code: "AS", reason: "Territory" },
  "66": { name: "Guam", code: "GU", reason: "Territory" },
  "69": { name: "Northern Mariana Islands", code: "MP", reason: "Territory" },
  "72": { name: "Puerto Rico", code: "PR", reason: "Territory" },
  "78": { name: "Virgin Islands", code: "VI", reason: "Territory" }
};

// State names by code (Continental US only - 48 states)
export const STATE_NAMES = {
  [USA_STATE_CODE]: 'United States',
  AL: 'Alabama',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  [UNASSIGNED_STATE_CODE]: 'Unassigned',
};

export const STATE_NAMES_ARRAY = Object.entries(STATE_NAMES).map(
  ([code, name]) => ({
    code,
    name,
  }),
);

export const STATE_CODES = STATE_NAMES_ARRAY.reduce(
  (acc, { code, name }) => ({ ...acc, [name]: code }),
  {},
);

// FIPS to state code mapping (for converting FIPS to our state codes)
export const FIPS_TO_STATE_CODE = Object.entries(US_STATE_FIPS).reduce(
  (acc, [fips, { code }]) => ({ ...acc, [fips]: code }),
  {}
);

// State code to FIPS mapping (reverse lookup)
export const STATE_CODE_TO_FIPS = Object.entries(US_STATE_FIPS).reduce(
  (acc, [fips, { code }]) => ({ ...acc, [code]: fips }),
  {}
);

// Helper function for robust state code lookup
export const getStateCodeFromName = (stateName) => {
  if (!stateName) return null;
  
  // Try direct lookup first
  let stateCode = STATE_CODES[stateName];
  if (stateCode) return stateCode;
  
  // Try proper case
  const properCase = stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();
  stateCode = STATE_CODES[properCase];
  if (stateCode) return stateCode;
  
  // Try title case
  const titleCase = stateName.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  stateCode = STATE_CODES[titleCase];
  if (stateCode) return stateCode;
  
  // Manual mapping for uppercase state names
  const uppercaseMapping = {
    'ALABAMA': 'AL', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
    'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL',
    'GEORGIA': 'GA', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN',
    'IOWA': 'IA', 'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA',
    'MAINE': 'ME', 'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI',
    'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO', 'MONTANA': 'MT',
    'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
    'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND',
    'OHIO': 'OH', 'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA',
    'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD',
    'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
    'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
    'WISCONSIN': 'WI', 'WYOMING': 'WY'
  };
  
  return uppercaseMapping[stateName.toUpperCase()] || null;
};

// Debug function to help troubleshoot state name mappings
export const debugStateMapping = (inputStateName) => {
  console.log('🔍 Debug State Mapping for:', inputStateName);
  
  // Show all available state codes
  console.log('Available STATE_CODES keys:', Object.keys(STATE_CODES));
  
  // Try different variations
  const variations = [
    inputStateName,
    inputStateName.toUpperCase(),
    inputStateName.toLowerCase(),
    inputStateName.charAt(0).toUpperCase() + inputStateName.slice(1).toLowerCase(),
    inputStateName.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  ];
  
  variations.forEach(variation => {
    const result = STATE_CODES[variation];
    console.log(`"${variation}" -> ${result || 'NOT FOUND'}`);
  });
  
  return STATE_CODES[inputStateName];
};

// Map files configuration
export const MAP_FILES = {
  // Main US map
  [USA_STATE_CODE]: 'us-states.json',
  
  // Individual states will use filtered counties from us-counties.json
  // We'll handle this dynamically in the useMap hook (Continental US only)
  AL: 'us-counties.json',
  AZ: 'us-counties.json',
  AR: 'us-counties.json',
  CA: 'us-counties.json',
  CO: 'us-counties.json',
  CT: 'us-counties.json',
  DE: 'us-counties.json',
  FL: 'us-counties.json',
  GA: 'us-counties.json',
  ID: 'us-counties.json',
  IL: 'us-counties.json',
  IN: 'us-counties.json',
  IA: 'us-counties.json',
  KS: 'us-counties.json',
  KY: 'us-counties.json',
  LA: 'us-counties.json',
  ME: 'us-counties.json',
  MD: 'us-counties.json',
  MA: 'us-counties.json',
  MI: 'us-counties.json',
  MN: 'us-counties.json',
  MS: 'us-counties.json',
  MO: 'us-counties.json',
  MT: 'us-counties.json',
  NE: 'us-counties.json',
  NV: 'us-counties.json',
  NH: 'us-counties.json',
  NJ: 'us-counties.json',
  NM: 'us-counties.json',
  NY: 'us-counties.json',
  NC: 'us-counties.json',
  ND: 'us-counties.json',
  OH: 'us-counties.json',
  OK: 'us-counties.json',
  OR: 'us-counties.json',
  PA: 'us-counties.json',
  RI: 'us-counties.json',
  SC: 'us-counties.json',
  SD: 'us-counties.json',
  TN: 'us-counties.json',
  TX: 'us-counties.json',
  UT: 'us-counties.json',
  VT: 'us-counties.json',
  VA: 'us-counties.json',
  WA: 'us-counties.json',
  WV: 'us-counties.json',
  WI: 'us-counties.json',
  WY: 'us-counties.json',
};

export const UNASSIGNED_CROP_CODE = 'UN';
export const ALL_CROPS_CODE = 'ALL';

// US Crop names - major agricultural crops
export const CROP_NAMES = {
  [ALL_CROPS_CODE]: 'All Crops',
  
  // Major Field Crops
  CO: 'Corn',
  SO: 'Soybeans',
  WH: 'Wheat',
  CT: 'Cotton',
  RI: 'Rice',
  SG: 'Sorghum',
  BA: 'Barley',
  OA: 'Oats',
  RY: 'Rye',
  
  // Specialty Crops
  AL: 'Almonds',
  AP: 'Apples',
  AV: 'Avocados',
  BR: 'Broccoli',
  CA: 'Carrots',
  CI: 'Citrus',
  CR: 'Cranberries',
  GR: 'Grapes',
  LE: 'Lettuce',
  ON: 'Onions',
  OR: 'Oranges',
  PE: 'Peaches',
  PO: 'Potatoes',
  ST: 'Strawberries',
  TO: 'Tomatoes',
  
  // Other Important Crops
  HA: 'Hay',
  SU: 'Sugar Beets',
  SC: 'Sugarcane',
  SN: 'Sunflower',
  CA: 'Canola',
  PE: 'Peanuts',
  SW: 'Sweet Potatoes',
  TA: 'Tobacco',
  
  [UNASSIGNED_CROP_CODE]: 'Data not available',
};

export const CROP_NAMES_ARRAY = Object.entries(CROP_NAMES).map(
  ([code, name]) => ({
    code,
    name,
  }),
);

// US Crop colors - updated for major US crops
export const CROP_COLORS = {
  // Major Field Crops
  CO: '#FFD700', // Corn - Golden
  SO: '#90EE90', // Soybeans - Light Green
  WH: '#DEB887', // Wheat - Burlywood
  CT: '#F0F8FF', // Cotton - Alice Blue
  RI: '#E6E6FA', // Rice - Lavender
  SG: '#CD853F', // Sorghum - Peru
  BA: '#F4A460', // Barley - Sandy Brown
  OA: '#FFEFD5', // Oats - Papaya Whip
  RY: '#D2B48C', // Rye - Tan
  
  // Fruits & Vegetables
  AL: '#DDA0DD', // Almonds - Plum
  AP: '#FF6347', // Apples - Tomato Red
  AV: '#9ACD32', // Avocados - Yellow Green
  BR: '#228B22', // Broccoli - Forest Green
  CA: '#FF8C00', // Carrots - Dark Orange
  CI: '#FFA500', // Citrus - Orange
  CR: '#DC143C', // Cranberries - Crimson
  GR: '#800080', // Grapes - Purple
  LE: '#ADFF2F', // Lettuce - Green Yellow
  ON: '#F5F5DC', // Onions - Beige
  OR: '#FF4500', // Oranges - Orange Red
  PE: '#FFCCCB', // Peaches - Light Pink
  PO: '#8B4513', // Potatoes - Saddle Brown
  ST: '#FF1493', // Strawberries - Deep Pink
  TO: '#FF6347', // Tomatoes - Tomato
  
  // Other Crops
  HA: '#32CD32', // Hay - Lime Green
  SU: '#F5F5F5', // Sugar Beets - White Smoke
  SC: '#98FB98', // Sugarcane - Pale Green
  SN: '#FFFF00', // Sunflower - Yellow
  PE: '#DEB887', // Peanuts - Burlywood
  SW: '#FF8C00', // Sweet Potatoes - Dark Orange
  TA: '#8FBC8F', // Tobacco - Dark Sea Green
  
  [UNASSIGNED_CROP_CODE]: '#E5E5E5', // Light Gray
};

export const CROP_METRICS_NAMES = {
  production: 'Production',
  yield: 'Yield',
  area: 'Harvested Area',
};

export const CROP_METRICS_UNITS = {
  production: 'Bushels', // Changed from Tonnes to Bushels (US standard)
  yield: 'Bu/Acre',      // Changed from Tonnes/Hectare to Bushels/Acre
  area: 'Acres',         // Changed from Hectares to Acres
};

export const CROP_METRICS_ARRAY = Object.entries(CROP_METRICS_NAMES).map(
  ([code, name]) => ({
    code,
    name,
  }),
);

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ALL_MONTHS_VALUE = 'All';

export const WEATHER_PARAMS = {
  temp: 'Temperature',
  clco: 'Cloud Cover',
  evpt: 'Evapotranspiration',
  prep: 'Precipitation',
};

export const WEATHER_UNITS = {
  temp: '°F', // Changed from Celsius to Fahrenheit
  clco: '%',
  evpt: '%',
  prep: 'in', // Changed from mm to inches
};

export const WEATHER_COLORS = {
  prep: '#1565c0',
  clco: '#455a64',
  temp: '#f57c00',
  evpt: '#388e3c',
};

export const WEATHER_INDICES = {
  pasm: 'Soil Moisture',
  ndvi: 'NDVI',
  ndwi: 'NDWI',
};

export const WEATHER_INDICES_UNITS = {
  pasm: '%',
  ndvi: '%',
  ndwi: '%',
};

export const WEATHER_INDICES_COLORS = {
  pasm: '#f57c00',
  ndvi: '#388e3c',
  ndwi: '#1565c0',
};

export const DISCLAIMER = '*based on available data';