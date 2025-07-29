// src/mockData.js - Updated for Sales Data
import { STATE_NAMES, SBU_NAMES, SBU_COLORS, DEPT_NAMES } from './constants';

// Helper function to generate random data
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// DASHBOARD MOCK DATA - Updated for Sales
export const MOCK_SBU_CATEGORIES = [
  {
    categoryName: "Electronics",
    sales: {
      value: 285000000, // $285M GMV
      series: [280000000, 275000000, 285000000],
      year: [2021, 2022, 2023],
      change: 3.6
    },
    orders: {
      value: 2750000, // 2.75M orders
      series: [2700000, 2720000, 2750000],
      year: [2021, 2022, 2023],
      change: 1.8
    }
  },
  {
    categoryName: "Clothing",
    sales: {
      value: 125000000, // $125M GMV
      series: [120000000, 118000000, 125000000],
      year: [2021, 2022, 2023],
      change: 6.4
    },
    orders: {
      value: 1850000, // 1.85M orders
      series: [1800000, 1820000, 1850000],
      year: [2021, 2022, 2023],
      change: 2.1
    }
  },
  {
    categoryName: "Home & Garden",
    sales: {
      value: 96000000, // $96M GMV
      series: [92000000, 90000000, 96000000],
      year: [2021, 2022, 2023],
      change: 4.3
    },
    orders: {
      value: 1420000, // 1.42M orders
      series: [1380000, 1400000, 1420000],
      year: [2021, 2022, 2023],
      change: 1.1
    }
  },
  {
    categoryName: "Sports",
    sales: {
      value: 78000000, // $78M GMV
      series: [75000000, 74000000, 78000000],
      year: [2021, 2022, 2023],
      change: 2.5
    },
    orders: {
      value: 980000, // 980K orders
      series: [950000, 965000, 980000],
      year: [2021, 2022, 2023],
      change: 1.6
    }
  },
  {
    categoryName: "Beauty",
    sales: {
      value: 62000000, // $62M GMV
      series: [58000000, 56000000, 62000000],
      year: [2021, 2022, 2023],
      change: 6.9
    }
  }
];

export const MOCK_TOP_SBUS = [
  {
    sbu: "EL", // Electronics
    series: [280000000, 275000000, 285000000, 290000000, 295000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Electronics sales increased by 2.4% this year",
        "Strong demand for smartphones and laptops"
      ],
      sales: [
        "Electronics sales increased by 2.4% this year",
        "Strong demand for smartphones and laptops"
      ]
    }
  },
  {
    sbu: "CL", // Clothing
    series: [120000000, 118000000, 125000000, 128000000, 132000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Clothing sales grew by 1.8% annually",
        "Women's apparel leading the category"
      ],
      sales: [
        "Clothing sales grew by 1.8% annually",
        "Women's apparel leading the category"
      ]
    }
  },
  {
    sbu: "HG", // Home & Garden
    series: [85000000, 88000000, 92000000, 96000000, 98000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Home & Garden showed strong growth of 4.7%",
        "Furniture and decor driving sales"
      ],
      sales: [
        "Home & Garden showed strong growth of 4.7%",
        "Furniture and decor driving sales"
      ]
    }
  },
  {
    sbu: "SP", // Sports
    series: [70000000, 72000000, 75000000, 78000000, 82000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Sports category steady growth at 5.1%",
        "Athletic wear and equipment performing well"
      ],
      sales: [
        "Sports category steady growth at 5.1%",
        "Athletic wear and equipment performing well"
      ]
    }
  },
  {
    sbu: "BT", // Beauty
    series: [52000000, 55000000, 58000000, 62000000, 65000000],
    year: [2019, 2020, 2021, 2022, 2023],
    insights: {
      production: [
        "Beauty sales reached record $65M",
        "Skincare and makeup driving growth"
      ],
      sales: [
        "Beauty sales reached record $65M",
        "Skincare and makeup driving growth"
      ]
    }
  }
];

export const MOCK_MAP_SUMMARY = [
  {
    location: "CALIFORNIA",
    topSBUs: [
      { sbu: "EL", value: 85000000 },
      { sbu: "CL", value: 42000000 },
      { sbu: "HG", value: 18000000 }
    ]
  },
  {
    location: "NEW YORK",
    topSBUs: [
      { sbu: "CL", value: 32000000 },
      { sbu: "EL", value: 28000000 },
      { sbu: "BT", value: 22000000 }
    ]
  },
  {
    location: "TEXAS",
    topSBUs: [
      { sbu: "EL", value: 45000000 },
      { sbu: "SP", value: 18000000 },
      { sbu: "HG", value: 12000000 }
    ]
  },
  {
    location: "FLORIDA",
    topSBUs: [
      { sbu: "CL", value: 28000000 },
      { sbu: "BT", value: 15000000 },
      { sbu: "SP", value: 12000000 }
    ]
  },
  {
    location: "ILLINOIS",
    topSBUs: [
      { sbu: "EL", value: 35000000 },
      { sbu: "HG", value: 18000000 },
      { sbu: "CL", value: 15000000 }
    ]
  },
  {
    location: "PENNSYLVANIA",
    topSBUs: [
      { sbu: "HG", value: 22000000 },
      { sbu: "EL", value: 20000000 },
      { sbu: "CL", value: 15000000 }
    ]
  },
  {
    location: "OHIO",
    topSBUs: [
      { sbu: "EL", value: 25000000 },
      { sbu: "SP", value: 12000000 },
      { sbu: "HG", value: 10000000 }
    ]
  },
  {
    location: "MICHIGAN",
    topSBUs: [
      { sbu: "EL", value: 22000000 },
      { sbu: "SP", value: 15000000 },
      { sbu: "CL", value: 12000000 }
    ]
  }
];

export const MOCK_SBU_MAP_DATA = [
  {
    location: "CALIFORNIA",
    years: [{ year: 2023, value: 85000000 }]
  },
  {
    location: "NEW YORK", 
    years: [{ year: 2023, value: 32000000 }]
  },
  {
    location: "TEXAS",
    years: [{ year: 2023, value: 45000000 }]
  },
  {
    location: "FLORIDA",
    years: [{ year: 2023, value: 28000000 }]
  },
  {
    location: "ILLINOIS",
    years: [{ year: 2023, value: 35000000 }]
  },
  {
    location: "PENNSYLVANIA",
    years: [{ year: 2023, value: 22000000 }]
  },
  {
    location: "OHIO",
    years: [{ year: 2023, value: 25000000 }]
  },
  {
    location: "MICHIGAN",
    years: [{ year: 2023, value: 22000000 }]
  }
];

export const MOCK_SALES_TABLE = [
  {
    stateCode: "CA",
    year: 2023,
    sbuCode: "EL",
    deptCode: "EL_SM",
    value: 85000000,
    yoyGrowthPercent: 8.5,
    yoyGrowthDollar: 6700000
  },
  {
    stateCode: "NY",
    year: 2023,
    sbuCode: "CL",
    deptCode: "CL_WO", 
    value: 32000000,
    yoyGrowthPercent: 5.2,
    yoyGrowthDollar: 1600000
  },
  {
    stateCode: "TX",
    year: 2023,
    sbuCode: "EL",
    deptCode: "EL_LA",
    value: 45000000,
    yoyGrowthPercent: 6.8,
    yoyGrowthDollar: 2900000
  },
  {
    stateCode: "FL",
    year: 2023,
    sbuCode: "CL",
    deptCode: "CL_ME",
    value: 28000000,
    yoyGrowthPercent: 4.3,
    yoyGrowthDollar: 1150000
  },
  {
    stateCode: "IL",
    year: 2023,
    sbuCode: "EL",
    deptCode: "EL_TA",
    value: 35000000,
    yoyGrowthPercent: 7.2,
    yoyGrowthDollar: 2350000
  },
  {
    stateCode: "PA",
    year: 2023,
    sbuCode: "HG",
    deptCode: "HG_FU",
    value: 22000000,
    yoyGrowthPercent: 3.8,
    yoyGrowthDollar: 820000
  },
  {
    stateCode: "OH",
    year: 2023,
    sbuCode: "SP",
    deptCode: "SP_AT",
    value: 15000000,
    yoyGrowthPercent: -2.1,
    yoyGrowthDollar: -320000
  },
  {
    stateCode: "GA",
    year: 2023,
    sbuCode: "BT",
    deptCode: "BT_SK",
    value: 18000000,
    yoyGrowthPercent: 9.2,
    yoyGrowthDollar: 1520000
  }
];

// IMPORT/EXPORT MOCK DATA - Updated for B2B Sales
export const MOCK_B2B_WHOLESALE = {
  b2b: {
    data: [
      { label: "Enterprise Clients", value: 125000000 },
      { label: "Retail Partners", value: 98000000 },
      { label: "Distributors", value: 67000000 },
      { label: "Franchise Partners", value: 45000000 },
      { label: "International", value: 32000000 },
      { label: "Other B2B", value: 28000000 }
    ]
  },
  wholesale: {
    data: [
      { label: "Major Retailers", value: 156000000 },
      { label: "Regional Chains", value: 89000000 },
      { label: "Online Platforms", value: 78000000 },
      { label: "Specialty Stores", value: 56000000 },
      { label: "Department Stores", value: 43000000 },
      { label: "Other Wholesale", value: 35000000 }
    ]
  }
};

// WEATHER MOCK DATA (keeping for consistency)
export const MOCK_WEATHER_DATA = [
  {
    location: "CALIFORNIA",
    years: [
      {
        year: 2023,
        value: 68.5, // Average temperature
        series: [62.1, 65.3, 68.9, 72.1, 75.2, 79.8, 82.4, 81.9, 78.1, 73.3, 66.8, 63.4]
      }
    ]
  },
  {
    location: "NEW YORK",
    years: [
      {
        year: 2023,
        value: 54.2,
        series: [38.5, 42.1, 52.2, 62.8, 71.1, 78.2, 82.1, 79.8, 72.4, 61.9, 48.3, 39.1]
      }
    ]
  },
  {
    location: "TEXAS",
    years: [
      {
        year: 2023,
        value: 76.8,
        series: [58.2, 62.7, 70.1, 77.5, 84.2, 90.8, 95.1, 94.4, 88.1, 79.2, 65.8, 59.6]
      }
    ]
  }
];

export const MOCK_WEATHER_SUMMARY = [
  {
    param: "temp",
    value: 68.5,
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
    stateCode: "CA",
    year: 2023,
    month: 6,
    temp: 79.8,
    prep: 0.2,
    clco: 15,
    evpt: 142
  },
  {
    stateCode: "NY",
    year: 2023,
    month: 6,
    temp: 78.2,
    prep: 3.8,
    clco: 65,
    evpt: 156
  },
  {
    stateCode: "TX",
    year: 2023,
    month: 6,
    temp: 90.8,
    prep: 2.1,
    clco: 45,
    evpt: 168
  }
];

// WAREHOUSE MOCK DATA - Updated for Distribution Centers
export const MOCK_WAREHOUSE_SUMMARY = [
  {
    location: "CALIFORNIA",
    warehouses: [
      { type: "Distribution Center", capacity: 2500000, count: 8 },
      { type: "Fulfillment Center", capacity: 1800000, count: 12 },
      { type: "Local Hubs", capacity: 800000, count: 24 }
    ]
  },
  {
    location: "TEXAS",
    warehouses: [
      { type: "Distribution Center", capacity: 2200000, count: 6 },
      { type: "Fulfillment Center", capacity: 1600000, count: 10 },
      { type: "Local Hubs", capacity: 700000, count: 18 }
    ]
  },
  {
    location: "NEW YORK",
    warehouses: [
      { type: "Distribution Center", capacity: 1800000, count: 5 },
      { type: "Fulfillment Center", capacity: 1200000, count: 8 },
      { type: "Local Hubs", capacity: 600000, count: 16 }
    ]
  }
];

export const MOCK_WAREHOUSE_TOTALS = [
  {
    type: "Distribution Centers",
    count: 45,
    capacity: 15600000
  },
  {
    type: "Fulfillment Centers", 
    count: 67,
    capacity: 12400000
  },
  {
    type: "Local Hubs",
    count: 156,
    capacity: 8900000
  }
];

export const MOCK_WAREHOUSE_TABLE = [
  {
    type: "Distribution Center",
    warehouse: "West Coast Distribution - Los Angeles",
    total: 850000,
    stateCode: "CA"
  },
  {
    type: "Fulfillment Center",
    warehouse: "Prime Fulfillment - San Francisco",
    total: 620000,
    stateCode: "CA"
  },
  {
    type: "Local Hub",
    warehouse: "Quick Ship Hub - San Diego",
    total: 180000,
    stateCode: "CA"
  },
  {
    type: "Distribution Center",
    warehouse: "Central Distribution - Dallas",
    total: 780000,
    stateCode: "TX"
  }
];

// PRICING MOCK DATA - Updated for GMV Analytics with Forecast
export const MOCK_PRICING_SUMMARY = [
  {
    sbu: "Electronics",
    years: [2021, 2022, 2023, 2024],
    actualGMV: [285000000, 290000000, 295000000, 310000000],
    forecastGMV: [280000000, 292000000, 298000000, 305000000],
    avgPrice: [450, 468, 489, 515],
    residualExplanations: {
      0: { // 2021 - high positive residual
        residual: 5000000,
        reasons: [
          "Holiday season surge exceeded expectations by 15%",
          "New product launch (iPhone 13) drove unexpected demand spike",
          "Supply chain constraints in competitor products boosted market share"
        ],
        impact: "positive",
        confidence: 0.95
      },
      3: { // 2024 - high positive residual  
        residual: 5000000,
        reasons: [
          "AI-powered electronics category experiencing 20% growth",
          "Back-to-school season performed 18% above forecast",
          "Premium segment adoption faster than anticipated"
        ],
        impact: "positive",
        confidence: 0.88
      }
    },
    insights: {
      demand: ["Strong consumer demand", "Premium product mix growing"],
      competition: ["Competitive pricing pressure", "Value positioning important"],
      pricing: ["Price optimization ongoing", "Premium segment expansion"],
      market: ["Market share gains", "Customer satisfaction high"]
    }
  },
  {
    sbu: "Clothing",
    years: [2021, 2022, 2023, 2024],
    actualGMV: [125000000, 118000000, 132000000, 128000000],
    forecastGMV: [120000000, 125000000, 128000000, 135000000],
    avgPrice: [85, 92, 98, 105],
    residualExplanations: {
      1: { // 2022 - high negative residual
        residual: -7000000,
        reasons: [
          "Unseasonably warm winter reduced coat and sweater sales by 25%",
          "Supply chain delays for spring fashion lines missed peak season",
          "Fast fashion competitor aggressive pricing impacted margins"
        ],
        impact: "negative",
        confidence: 0.92
      },
      2: { // 2023 - high positive residual
        residual: 4000000,
        reasons: [
          "Sustainable fashion line exceeded expectations by 30%",
          "Celebrity endorsement campaign drove viral social media engagement",
          "Return to office trends boosted professional wear sales"
        ],
        impact: "positive", 
        confidence: 0.87
      },
      3: { // 2024 - high negative residual
        residual: -7000000,
        reasons: [
          "Economic uncertainty reduced discretionary clothing spending",
          "Inventory management issues led to stock-outs during peak seasons",
          "Shift to athleisure trend not captured in forecast models"
        ],
        impact: "negative",
        confidence: 0.91
      }
    },
    insights: {
      demand: ["Seasonal demand patterns", "Fashion trends driving sales"],
      competition: ["Fast fashion competition", "Brand differentiation key"],
      pricing: ["Dynamic pricing strategy", "Promotional pricing effective"],
      market: ["Omnichannel growth", "Sustainability focus increasing"]
    }
  },
  {
    sbu: "Home & Garden",
    years: [2021, 2022, 2023, 2024],
    actualGMV: [96000000, 102000000, 98000000, 105000000],
    forecastGMV: [92000000, 98000000, 103000000, 108000000],
    avgPrice: [120, 125, 135, 142],
    residualExplanations: {
      0: { // 2021 - high positive residual
        residual: 4000000,
        reasons: [
          "COVID-19 home improvement boom exceeded all forecasts",
          "Garden equipment sales surged 40% with work-from-home trends",
          "DIY project supplies shortage drove premium product sales"
        ],
        impact: "positive",
        confidence: 0.96
      },
      2: { // 2023 - high negative residual
        residual: -5000000,
        reasons: [
          "Interest rate increases reduced home renovation spending",
          "Unusual drought conditions impacted garden supply sales by 30%",
          "Housing market slowdown reduced new homeowner purchases"
        ],
        impact: "negative",
        confidence: 0.89
      }
    },
    insights: {
      demand: ["Home improvement trends", "Seasonal gardening patterns"],
      competition: ["Big box retailer competition", "Online marketplace growth"],
      pricing: ["Premium brand positioning", "Bundle pricing strategies"],
      market: ["DIY market expansion", "Smart home integration growing"]
    }
  }
];

export const MOCK_PRICING_CODES = {
  channels: [
    ["Online", "online"],
    ["Retail", "retail"], 
    ["Wholesale", "wholesale"],
    ["B2B", "b2b"]
  ],
  sbus: [
    ["Electronics", "electronics"],
    ["Clothing", "clothing"],
    ["Home & Garden", "home_garden"],
    ["Sports", "sports"],
    ["Beauty", "beauty"]
  ]
};

export const MOCK_PRICING_TRENDS = [
  { year: 2023, month: 1, avgPrice: 445, marginPercent: 28.5 },
  { year: 2023, month: 2, avgPrice: 458, marginPercent: 29.2 },
  { year: 2023, month: 3, avgPrice: 472, marginPercent: 30.1 },
  { year: 2023, month: 4, avgPrice: 485, marginPercent: 29.8 },
  { year: 2023, month: 5, avgPrice: 498, marginPercent: 31.2 },
  { year: 2023, month: 6, avgPrice: 512, marginPercent: 32.1 }
];

// SBU vs MARKET FACTORS MOCK DATA
export const MOCK_SBU_VS_MARKET = [
  {
    values: [
      { year: 2019, value: 280000000 },
      { year: 2020, value: 275000000 },
      { year: 2021, value: 285000000 },
      { year: 2022, value: 290000000 },
      { year: 2023, value: 295000000 }
    ],
    marketIndex: [
      { year: 2019, value: 105.2 },
      { year: 2020, value: 98.5 },
      { year: 2021, value: 108.7 },
      { year: 2022, value: 112.3 },
      { year: 2023, value: 118.9 }
    ],
    consumerSentiment: [
      { year: 2019, value: 88.5 },
      { year: 2020, value: 76.2 },
      { year: 2021, value: 82.1 },
      { year: 2022, value: 85.8 },
      { year: 2023, value: 91.3 }
    ],
    competitorIndex: [
      { year: 2019, value: 95.8 },
      { year: 2020, value: 89.3 },
      { year: 2021, value: 97.2 },
      { year: 2022, value: 102.1 },
      { year: 2023, value: 106.7 }
    ],
    economicIndex: [
      { year: 2019, value: 102.5 },
      { year: 2020, value: 87.2 },
      { year: 2021, value: 95.8 },
      { year: 2022, value: 103.2 },
      { year: 2023, value: 108.9 }
    ]
  }
];

// PDF DIRECTORY MOCK DATA - Updated for Business Documents
export const MOCK_PDF_DIRECTORY = [
  {
    category: "Financial Reports",
    name: "Q4 2023 Sales Report",
    filename: "q4-2023-sales-report.pdf",
    thumbnail: "sales-report-thumb.jpg"
  },
  {
    category: "Financial Reports", 
    name: "Annual Performance Review 2023",
    filename: "annual-performance-2023.pdf",
    thumbnail: "annual-review-thumb.jpg"
  },
  {
    category: "Strategy Documents",
    name: "SBU Growth Strategy 2024",
    filename: "sbu-growth-strategy-2024.pdf", 
    thumbnail: "strategy-thumb.jpg"
  },
  {
    category: "Strategy Documents",
    name: "Market Expansion Plan",
    filename: "market-expansion-plan.pdf",
    thumbnail: "expansion-plan-thumb.jpg"
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