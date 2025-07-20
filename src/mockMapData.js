// src/mockMapData.js
export const MOCK_INDIA_MAP = {
  "type": "Topology",
  "arcs": [
    // Simplified arcs for India map - this is a minimal version
    [[[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]]
  ],
  "transform": {
    "scale": [0.01, 0.01],
    "translate": [68, 6]
  },
  "objects": {
    "states": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "MH",
            "st_nm": "MAHARASHTRA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon", 
          "properties": {
            "st_code": "UP",
            "st_nm": "UTTAR PRADESH"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "PB",
            "st_nm": "PUNJAB"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "HR",
            "st_nm": "HARYANA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "MP",
            "st_nm": "MADHYA PRADESH"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "RJ",
            "st_nm": "RAJASTHAN"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "GJ",
            "st_nm": "GUJARAT"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "WB",
            "st_nm": "WEST BENGAL"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "TN",
            "st_nm": "TAMIL NADU"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "KA",
            "st_nm": "KARNATAKA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "KL",
            "st_nm": "KERALA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "OR",
            "st_nm": "ODISHA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "AP",
            "st_nm": "ANDHRA PRADESH"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "TG",
            "st_nm": "TELANGANA"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "AS",
            "st_nm": "ASSAM"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "BR",
            "st_nm": "BIHAR"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "CT",
            "st_nm": "CHHATTISGARH"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "JH",
            "st_nm": "JHARKHAND"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "HP",
            "st_nm": "HIMACHAL PRADESH"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "UT",
            "st_nm": "UTTARAKHAND"
          }
        },
        {
          "arcs": [[0]],
          "type": "Polygon",
          "properties": {
            "st_code": "DL",
            "st_nm": "DELHI"
          }
        }
      ]
    }
  }
};

// Create a generic state map template
export const createStateMockMap = (stateName, districts = []) => ({
  "type": "Topology",
  "arcs": [
    [[[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]]
  ],
  "transform": {
    "scale": [0.01, 0.01],
    "translate": [68, 6]
  },
  "objects": {
    "districts": {
      "type": "GeometryCollection",
      "geometries": districts.length > 0 ? districts.map((district, index) => ({
        "arcs": [[0]],
        "type": "Polygon",
        "properties": {
          "district": district,
          "st_nm": stateName,
          "district_code": `${stateName.substring(0, 2).toUpperCase()}-${district.substring(0, 3).toUpperCase()}`
        }
      })) : [{
        "arcs": [[0]],
        "type": "Polygon",
        "properties": {
          "district": stateName,
          "st_nm": stateName,
          "district_code": `${stateName.substring(0, 2).toUpperCase()}-MAIN`
        }
      }]
    }
  }
});

// State-wise district data
export const STATE_DISTRICTS = {
  "MAHARASHTRA": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
  "UTTAR PRADESH": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Bareilly"],
  "PUNJAB": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
  "HARYANA": ["Gurgaon", "Faridabad", "Hisar", "Panipat", "Karnal", "Ambala"],
  "MADHYA PRADESH": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"],
  "RAJASTHAN": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
  "GUJARAT": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Gandhinagar"],
  "WEST BENGAL": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling"],
  "TAMIL NADU": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
  "KARNATAKA": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
  "KERALA": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad"],
  "ODISHA": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
  "ANDHRA PRADESH": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
  "TELANGANA": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar"],
  "ASSAM": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "BIHAR": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
  "CHHATTISGARH": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon"],
  "JHARKHAND": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribag"],
  "HIMACHAL PRADESH": ["Shimla", "Kangra", "Mandi", "Solan", "Una", "Hamirpur"],
  "UTTARAKHAND": ["Dehradun", "Haridwar", "Roorkee", "Rishikesh", "Nainital", "Mussoorie"],
  "DELHI": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"]
};

// Generate all state maps
export const MOCK_STATE_MAPS = Object.entries(STATE_DISTRICTS).reduce((maps, [state, districts]) => {
  const stateCode = state.substring(0, 2).toUpperCase();
  return {
    ...maps,
    [stateCode]: createStateMockMap(state, districts)
  };
}, {});

// Map file mapping for mock data
export const MOCK_MAP_FILES = {
  "TT": MOCK_INDIA_MAP, // India map
  "MH": MOCK_STATE_MAPS.MA,
  "UP": MOCK_STATE_MAPS.UT,
  "PB": MOCK_STATE_MAPS.PU,
  "HR": MOCK_STATE_MAPS.HA,
  "MP": MOCK_STATE_MAPS.MA,
  "RJ": MOCK_STATE_MAPS.RA,
  "GJ": MOCK_STATE_MAPS.GU,
  "WB": MOCK_STATE_MAPS.WE,
  "TN": MOCK_STATE_MAPS.TA,
  "KA": MOCK_STATE_MAPS.KA,
  "KL": MOCK_STATE_MAPS.KE,
  "OR": MOCK_STATE_MAPS.OD,
  "AP": MOCK_STATE_MAPS.AN,
  "TG": MOCK_STATE_MAPS.TE,
  "AS": MOCK_STATE_MAPS.AS,
  "BR": MOCK_STATE_MAPS.BI,
  "CT": MOCK_STATE_MAPS.CH,
  "JH": MOCK_STATE_MAPS.JH,
  "HP": MOCK_STATE_MAPS.HI,
  "UT": MOCK_STATE_MAPS.UT,
  "DL": MOCK_STATE_MAPS.DE
};