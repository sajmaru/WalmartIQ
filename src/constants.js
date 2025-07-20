export const HOST_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/' 
  : `${window.location.protocol}//${window.location.host}/`;

console.log('🗺️ Map URL example:', `${HOST_URL}maps/india.json`);
console.log('🗺️ HOST_URL:', HOST_URL);
console.log('🗺️ NODE_ENV:', process.env.NODE_ENV);

export const API_HOST_URL = 'https://bd519d3f8f20.ngrok.io/';

export const UNASSIGNED_STATE_CODE = 'UN';
export const INDIA_STATE_CODE = 'TT';

export const STATE_NAMES = {
  [INDIA_STATE_CODE]: 'India',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CT: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UT: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
  AN: 'Andaman and Nicobar Islands',
  CH: 'Chandigarh',
  DN: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  JK: 'Jammu and Kashmir',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  PY: 'Puducherry',
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

export const MAP_FILES = {
  AP: 'andhrapradesh.json',
  AR: 'arunachalpradesh.json',
  AS: 'assam.json',
  BR: 'bihar.json',
  CT: 'chhattisgarh.json',
  GA: 'goa.json',
  GJ: 'gujarat.json',
  HR: 'haryana.json',
  HP: 'himachalpradesh.json',
  JK: 'jammukashmir.json',
  JH: 'jharkhand.json',
  KA: 'karnataka.json',
  KL: 'kerala.json',
  MP: 'madhyapradesh.json',
  MH: 'maharashtra.json',
  MN: 'manipur.json',
  ML: 'meghalaya.json',
  MZ: 'mizoram.json',
  NL: 'nagaland.json',
  OR: 'odisha.json',
  PB: 'punjab.json',
  RJ: 'rajasthan.json',
  SK: 'sikkim.json',
  TN: 'tamilnadu.json',
  TG: 'telangana.json',
  TR: 'tripura.json',
  UT: 'uttarakhand.json',
  UP: 'uttarpradesh.json',
  WB: 'westbengal.json',
  AN: 'andamannicobarislands.json',
  CH: 'chandigarh.json',
  DN: 'dnh-and-dd.json',
  DL: 'delhi.json',
  LA: 'ladakh.json',
  LD: 'lakshadweep.json',
  PY: 'puducherry.json',
  [INDIA_STATE_CODE]: 'india.json',
};

export const UNASSIGNED_CROP_CODE = 'UN';
export const ALL_CROPS_CODE = 'ALL';

export const CROP_NAMES = {
  [ALL_CROPS_CODE]: 'All Crops',
  WH: 'Wheat',
  BA: 'Banana',
  CA: 'Cashewnut',
  CO: 'Coconut',
  CR: 'Coriander',
  SW: 'Sweet Potato',
  TA: 'Tapioca',
  TU: 'Turmeric',
  GI: 'Ginger',
  ME: 'Mesta',
  SO: 'Soyabean',
  OO: 'Other Oilseeds',
  CP: 'Cowpea(Lobia)',
  OI: 'Oilseeds Total',
  AR: 'Arhar/Tur',
  BJ: 'Bajra',
  CS: 'Castor Seed',
  CT: 'Cotton(lint)',
  DR: 'Dry Chillies',
  GR: 'Groundnut',
  JO: 'Jowar',
  MA: 'Maize',
  MO: 'Moong(Green Gram)',
  RI: 'Rice',
  SE: 'Sesamum',
  SM: 'Small Millets',
  SU: 'Sugarcane',
  SN: 'Sunflower',
  TO: 'Tobacco',
  UR: 'Urad',
  GM: 'Gram',
  ON: 'Onion',
  RA: 'Ragi',
  RP: 'Rapeseed & Mustard',
  HO: 'Horse-gram',
  AC: 'Arecanut',
  OP: 'Other Rabi Pulses',
  LI: 'Linseed',
  SA: 'Safflower',
  OK: 'Other Kharif Pulses',
  PO: 'Potato',
  NI: 'Niger Seed',
  JU: 'Jute',
  MS: 'Masoor',
  PE: 'Peas & Beans (Pulses)',
  BL: 'Black Pepper',
  GA: 'Garlic',
  SH: 'Sannhamp',
  BR: 'Barley',
  KH: 'Khesari',
  MT: 'Moth',
  OC: 'Other Cereals',
  GU: 'Guar Seed',
  CD: 'Cardamom',
  OS: 'Other Summer Pulses',
  [UNASSIGNED_CROP_CODE]: 'Data not available',
};

export const CROP_NAMES_ARRAY = Object.entries(CROP_NAMES).map(
  ([code, name]) => ({
    code,
    name,
  }),
);

export const CROP_COLORS = {
  RI: '#FFD147',
  SN: '#ffc107',
  WH: '#ffb300',
  RP: '#ff6f00',
  TU: '#ffab00',
  OP: '#2979ff',
  CP: '#b0bec5',
  UR: '#78909c',
  CS: '#455a64',
  SO: '#8d6e63',
  PO: '#795548',
  CO: '#6d4c41',
  CT: '#80deea',
  MT: '#006064',
  SM: '#18ffff',
  CD: '#f4511e',
  GR: '#ff9e80',
  MS: '#ff3d00',
  KH: '#dd2c00',
  OK: '#b388ff',
  GU: '#81c784',
  CR: '#388e3c',
  ME: '#1b5e20',
  AC: '#999999',
  JU: '#9e9e9e',
  BL: '#424242',
  OC: '#5c6bc0',
  GM: '#304ffe',
  PE: '#8bc34a',
  SU: '#b2ff59',
  BR: '#dce775',
  MO: '#d4e157',
  RA: '#c0ca33',
  BJ: '#9e9d24',
  GI: '#ffcc80',
  SW: '#ef6c00',
  SA: '#ffd180',
  AR: '#ff9100',
  GA: '#f8bbd0',
  ON: '#ec407a',
  TA: '#c2185b',
  HO: '#880e4f',
  LI: '#ff80ab',
  SH: '#f50057',
  OI: '#6a1b9a',
  JO: '#4a148c',
  DR: '#e53935',
  OO: '#ff8a80',
  TO: '#d50000',
  SE: '#00897b',
  OS: '#64ffda',
  CA: '#fff9c4',
  BA: '#ffeb3b',
  MA: '#ffff00',
  NI: '#01579b',
  [UNASSIGNED_CROP_CODE]: '#ffffff',
};

export const CROP_METRICS_NAMES = {
  production: 'Production',
  yield: 'Yield',
  area: 'Cultivation Area',
};

export const CROP_METRICS_UNITS = {
  production: 'Tonnes',
  yield: 'Tonnes/Hectare',
  area: 'Hectare',
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
  temp: '°C',
  clco: '%',
  evpt: '%',
  prep: 'mm',
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
