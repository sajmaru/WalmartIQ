// src/mockData.js
import { STATE_NAMES, CROP_NAMES, CROP_COLORS } from './constants';

// Helper function to generate random data
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// DASHBOARD MOCK DATA
export const MOCK_CROP_CATEGORIES = [
  {
    categoryName: "Cereals",
    production: {
      value: 285000000,
      series: [280000000, 275000000, 285000000],
      year: [2021, 2022, 2023],
      change: 3.6
    },
    consumption: {
      value: 275000000,
      series: [270000000, 272000000, 275000000],
      year: [2021, 2022, 2023],
      change: 1.8
    }
  },
  {
    categoryName: "Pulses",
    production: {
      value: 25000000,
      series: [24000000, 23500000, 25000000],
      year: [2021, 2022, 2023],
      change: 6.4
    },
    consumption: {
      value: 24500000,
      series: [24000000, 24200000, 24500000],
      year: [2021, 2022, 2023],
      change: 2.1
    }
  },
  {
    categoryName: "Oilseeds",
    production: {
      value: 36000000,
      series: [35000000, 34500000, 36000000],
      year: [2021, 2022, 2023],
      change: 4.3
    },
    consumption: {
      value: 35200000,
      series: [34800000, 35000000, 35200000],
      year: [2021, 2022, 2023],
      change: 1.1
    }
  },
  {
    categoryName: "Sugarcane",
    production: {
      value: 405000000,
      series: [400000000, 395000000, 405000000],
      year: [2021, 2022, 2023],
      change: 2.5
    },
    consumption: {
      value: 400000000,
      series: [398000000, 399000000, 400000000],
      year: [2021, 2022, 2023],
      change: 0.5
    }
  },
  {
    categoryName: "Cotton",
    production: {
      value: 6200000,
      series: [6000000, 5800000, 6200000],
      year: [2021, 2022, 2023],
      change: 6.9
    }
  },
  {
    categoryName: "Jute",
    production: {
      value: 1800000,
      series: [1750000, 1720000, 1800000],
      year: [2021, 2022, 2023],
      change: 4.7
    }
  }
];

export const MOCK_TOP_CROPS = [
  {
    crop: "RI", // Rice
    series: [116000000, 118000000, 120000000, 122000000, 124000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Rice production increased by 2.4% this year",
        "Favorable monsoon conditions boosted yields"
      ]
    }
  },
  {
    crop: "WH", // Wheat
    series: [103000000, 105000000, 107000000, 109000000, 111000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Wheat production grew by 1.8% annually",
        "Punjab and Haryana leading producers"
      ]
    }
  },
  {
    crop: "MA", // Maize
    series: [28000000, 29000000, 31000000, 32000000, 33500000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Maize showed strong growth of 4.7%",
        "Increasing demand from poultry sector"
      ]
    }
  },
  {
    crop: "SU", // Sugarcane
    series: [400000000, 395000000, 405000000, 410000000, 415000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Sugarcane production steady at 415M tonnes",
        "Maharashtra and Uttar Pradesh key states"
      ]
    }
  },
  {
    crop: "CT", // Cotton
    series: [5800000, 6000000, 5900000, 6100000, 6200000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Cotton production recovered to 6.2M bales",
        "Gujarat leading cotton producing state"
      ]
    }
  },
  {
    crop: "SO", // Soybean
    series: [12000000, 11500000, 12500000, 13000000, 13200000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Soybean production reached record 13.2M tonnes",
        "Madhya Pradesh dominates production"
      ]
    }
  }
];

export const MOCK_MAP_SUMMARY = [
  {
    location: "MAHARASHTRA",
    topCrops: [
      { crop: "SU", value: 85000000 },
      { crop: "SO", value: 4200000 },
      { crop: "CT", value: 1800000 }
    ]
  },
  {
    location: "UTTAR PRADESH",
    topCrops: [
      { crop: "WH", value: 32000000 },
      { crop: "RI", value: 14000000 },
      { crop: "SU", value: 22000000 }
    ]
  },
  {
    location: "PUNJAB",
    topCrops: [
      { crop: "WH", value: 18000000 },
      { crop: "RI", value: 11000000 },
      { crop: "MA", value: 1200000 }
    ]
  },
  {
    location: "HARYANA",
    topCrops: [
      { crop: "WH", value: 12000000 },
      { crop: "RI", value: 4500000 },
      { crop: "SU", value: 5000000 }
    ]
  },
  {
    location: "MADHYA PRADESH",
    topCrops: [
      { crop: "SO", value: 5800000 },
      { crop: "WH", value: 18000000 },
      { crop: "MA", value: 2200000 }
    ]
  },
  {
    location: "RAJASTHAN",
    topCrops: [
      { crop: "WH", value: 8500000 },
      { crop: "BJ", value: 2800000 },
      { crop: "MA", value: 1500000 }
    ]
  },
  {
    location: "GUJARAT",
    topCrops: [
      { crop: "CT", value: 2400000 },
      { crop: "WH", value: 3200000 },
      { crop: "GR", value: 5100000 }
    ]
  },
  {
    location: "WEST BENGAL",
    topCrops: [
      { crop: "RI", value: 15500000 },
      { crop: "WH", value: 1100000 },
      { crop: "PO", value: 11200000 }
    ]
  }
];

export const MOCK_CROP_MAP_DATA = [
  {
    location: "MAHARASHTRA",
    years: [{ year: 2023, value: 85000000 }]
  },
  {
    location: "UTTAR PRADESH", 
    years: [{ year: 2023, value: 32000000 }]
  },
  {
    location: "PUNJAB",
    years: [{ year: 2023, value: 18000000 }]
  },
  {
    location: "HARYANA",
    years: [{ year: 2023, value: 12000000 }]
  },
  {
    location: "MADHYA PRADESH",
    years: [{ year: 2023, value: 18000000 }]
  },
  {
    location: "RAJASTHAN",
    years: [{ year: 2023, value: 8500000 }]
  },
  {
    location: "GUJARAT",
    years: [{ year: 2023, value: 3200000 }]
  },
  {
    location: "WEST BENGAL",
    years: [{ year: 2023, value: 15500000 }]
  }
];

export const MOCK_PRODUCTION_TABLE = [
  {
    stateCode: "MH",
    year: 2023,
    cropCode: "SU",
    production: 85000000,
    yield: 75.2,
    area: 1130000
  },
  {
    stateCode: "UP",
    year: 2023,
    cropCode: "WH", 
    production: 32000000,
    yield: 32.8,
    area: 975000
  },
  {
    stateCode: "PB",
    year: 2023,
    cropCode: "WH",
    production: 18000000,
    yield: 51.2,
    area: 351000
  },
  {
    stateCode: "HR",
    year: 2023,
    cropCode: "WH",
    production: 12000000,
    yield: 48.5,
    area: 247000
  },
  {
    stateCode: "MP",
    year: 2023,
    cropCode: "SO",
    production: 5800000,
    yield: 11.2,
    area: 518000
  }
];

// IMPORT/EXPORT MOCK DATA
export const MOCK_IMPORT_EXPORT = {
  import: {
    data: [
      { label: "Pulses", value: 2500000 },
      { label: "Edible Oils", value: 13800000 },
      { label: "Fruits", value: 850000 },
      { label: "Spices", value: 320000 },
      { label: "Tea", value: 180000 },
      { label: "Other Imports", value: 1250000 } // Changed from "Others"
    ]
  },
  export: {
    data: [
      { label: "Rice", value: 21500000 },
      { label: "Wheat", value: 3200000 },
      { label: "Tea", value: 250000 },
      { label: "Spices", value: 1100000 },
      { label: "Fruits", value: 750000 },
      { label: "Other Exports", value: 2850000 } // Changed from "Others"
    ]
  }
};

// WEATHER MOCK DATA
export const MOCK_WEATHER_DATA = [
  {
    location: "MAHARASHTRA",
    years: [
      {
        year: 2023,
        value: 28.5, // Average for all months
        series: [22.1, 25.3, 28.9, 32.1, 35.2, 29.8, 26.4, 25.9, 27.1, 29.3, 26.8, 23.4]
      }
    ]
  },
  {
    location: "UTTAR PRADESH",
    years: [
      {
        year: 2023,
        value: 26.2,
        series: [18.5, 22.1, 27.2, 32.8, 36.1, 33.2, 30.1, 29.8, 28.4, 26.9, 22.3, 19.1]
      }
    ]
  },
  {
    location: "PUNJAB",
    years: [
      {
        year: 2023,
        value: 24.8,
        series: [14.2, 18.7, 24.1, 29.5, 34.2, 32.8, 31.1, 30.4, 28.1, 25.2, 19.8, 15.6]
      }
    ]
  }
];

export const MOCK_WEATHER_SUMMARY = [
  {
    param: "temp",
    value: 28.5,
    change: 2.3
  },
  {
    param: "prep", 
    value: 1150,
    change: -5.8
  },
  {
    param: "clco",
    value: 65,
    change: 3.2
  },
  {
    param: "evpt",
    value: 125,
    change: 1.8
  }
];

export const MOCK_WEATHER_TABLE = [
  {
    stateCode: "MH",
    year: 2023,
    month: 6,
    temp: 29.8,
    prep: 245,
    clco: 78,
    evpt: 142
  },
  {
    stateCode: "UP",
    year: 2023,
    month: 6,
    temp: 33.2,
    prep: 180,
    clco: 65,
    evpt: 156
  },
  {
    stateCode: "PB",
    year: 2023,
    month: 6,
    temp: 32.8,
    prep: 95,
    clco: 45,
    evpt: 168
  }
];

// WAREHOUSE MOCK DATA
export const MOCK_WAREHOUSE_SUMMARY = [
  {
    location: "MAHARASHTRA",
    warehouses: [
      { type: "FCI", capacity: 2500000, count: 145 },
      { type: "CWC", capacity: 1800000, count: 89 },
      { type: "Private", capacity: 3200000, count: 234 }
    ]
  },
  {
    location: "UTTAR PRADESH",
    warehouses: [
      { type: "FCI", capacity: 3200000, count: 198 },
      { type: "CWC", capacity: 2100000, count: 112 },
      { type: "Private", capacity: 4100000, count: 287 }
    ]
  },
  {
    location: "PUNJAB",
    warehouses: [
      { type: "FCI", capacity: 1800000, count: 95 },
      { type: "CWC", capacity: 1200000, count: 67 },
      { type: "Private", capacity: 2200000, count: 156 }
    ]
  }
];

export const MOCK_WAREHOUSE_TOTALS = [
  {
    type: "FCI Godowns",
    count: 1247,
    capacity: 15600000
  },
  {
    type: "Central Warehouses", 
    count: 892,
    capacity: 12400000
  },
  {
    type: "Private Warehouses",
    count: 3456,
    capacity: 28900000
  }
];

export const MOCK_WAREHOUSE_TABLE = [
  {
    type: "FCI",
    warehouse: "FCI Godown - Mumbai Central",
    total: 25000,
    stateCode: "MH"
  },
  {
    type: "CWC",
    warehouse: "Central Warehouse - Pune",
    total: 18000,
    stateCode: "MH"
  },
  {
    type: "Private",
    warehouse: "Reliance Storage - Nashik",
    total: 32000,
    stateCode: "MH"
  },
  {
    type: "FCI",
    warehouse: "FCI Godown - Kanpur",
    total: 28000,
    stateCode: "UP"
  }
];

// RATES MOCK DATA
export const MOCK_RATES_SUMMARY = [
  {
    crop: "Wheat",
    years: [2021, 2022, 2023, 2024],
    rates: [2150, 2280, 2450, 2680],
    insights: {
      rainfall: ["Normal monsoon expected", "Good soil moisture levels"],
      consumption: ["Steady domestic demand", "Export opportunities rising"],
      rates: ["Prices trending upward", "Government MSP support"],
      production: ["Production estimate stable", "Quality expected to be good"]
    }
  },
  {
    crop: "Rice",
    years: [2021, 2022, 2023, 2024],
    rates: [1950, 2100, 2250, 2380],
    insights: {
      rainfall: ["Adequate rainfall in key states", "Kharif season looks promising"],
      consumption: ["Strong export demand", "Domestic consumption steady"],
      rates: ["International prices favorable", "MSP providing floor support"],
      production: ["Record production expected", "Hybrid varieties performing well"]
    }
  }
];

export const MOCK_RATES_CODES = {
  centers: [
    ["Mumbai", "mumbai"],
    ["Delhi", "delhi"], 
    ["Kolkata", "kolkata"],
    ["Chennai", "chennai"]
  ],
  commodities: [
    ["Wheat", "wheat"],
    ["Rice", "rice"],
    ["Maize", "maize"],
    ["Soybean", "soybean"]
  ]
};

export const MOCK_RATES_TRENDS = [
  { year: 2023, month: 1, wholesaleRate: 2180, retailRate: 28 },
  { year: 2023, month: 2, wholesaleRate: 2200, retailRate: 29 },
  { year: 2023, month: 3, wholesaleRate: 2250, retailRate: 30 },
  { year: 2023, month: 4, wholesaleRate: 2280, retailRate: 31 },
  { year: 2023, month: 5, wholesaleRate: 2320, retailRate: 32 },
  { year: 2023, month: 6, wholesaleRate: 2350, retailRate: 33 }
];

// CROP vs WEATHER MOCK DATA
export const MOCK_CROP_VS_WEATHER = [
  {
    values: [
      { year: 2019, value: 116000000 },
      { year: 2020, value: 118000000 },
      { year: 2021, value: 120000000 },
      { year: 2022, value: 122000000 },
      { year: 2023, value: 124000000 }
    ],
    prep: [
      { year: 2019, value: 1180 },
      { year: 2020, value: 1220 },
      { year: 2021, value: 1150 },
      { year: 2022, value: 1280 },
      { year: 2023, value: 1200 }
    ],
    temp: [
      { year: 2019, value: 27.8 },
      { year: 2020, value: 28.2 },
      { year: 2021, value: 27.5 },
      { year: 2022, value: 28.8 },
      { year: 2023, value: 28.1 }
    ],
    clco: [
      { year: 2019, value: 62 },
      { year: 2020, value: 68 },
      { year: 2021, value: 58 },
      { year: 2022, value: 71 },
      { year: 2023, value: 65 }
    ],
    evpt: [
      { year: 2019, value: 118 },
      { year: 2020, value: 125 },
      { year: 2021, value: 112 },
      { year: 2022, value: 132 },
      { year: 2023, value: 128 }
    ],
    pasm: [
      { year: 2019, value: 45 },
      { year: 2020, value: 52 },
      { year: 2021, value: 38 },
      { year: 2022, value: 58 },
      { year: 2023, value: 48 }
    ]
  }
];

// PDF DIRECTORY MOCK DATA
export const MOCK_PDF_DIRECTORY = [
  {
    category: "Budget Documents",
    name: "Union Budget 2023-24",
    filename: "union-budget-2023-24.pdf",
    thumbnail: "budget-2023-thumb.jpg"
  },
  {
    category: "Budget Documents", 
    name: "Economic Survey 2022-23",
    filename: "economic-survey-2022-23.pdf",
    thumbnail: "economic-survey-thumb.jpg"
  },
  {
    category: "Policy Documents",
    name: "National Food Security Act",
    filename: "food-security-act.pdf", 
    thumbnail: "food-security-thumb.jpg"
  },
  {
    category: "Policy Documents",
    name: "PM-KISAN Scheme Guidelines",
    filename: "pm-kisan-guidelines.pdf",
    thumbnail: "pm-kisan-thumb.jpg"
  }
];

// CHECK DATA AVAILABILITY
export const MOCK_CHECK_DATA = {
  data: true // Always return true for mock data
};

// LATEST YEAR
export const MOCK_LATEST_YEAR = {
  year: 2023
};