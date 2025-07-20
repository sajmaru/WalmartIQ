// src/helpers.js - Fixed readableNumber function
export const readableNumber = (num, fixed = 1) => {
  // Handle null, undefined, and non-numeric values
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  // Check again after conversion
  if (isNaN(numValue)) {
    return 'N/A';
  }
  
  if (numValue === 0) return '0';
  
  try {
    const b = numValue.toPrecision(2).split('e');
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3);
    const c =
      k < 1 ? numValue.toFixed(0 + fixed) : (numValue / 10 ** (k * 3)).toFixed(1 + fixed);
    return c < 0 ? c : Math.abs(c) + ['', 'K', 'M', 'B', 'T'][k];
  } catch (error) {
    console.warn('Error formatting number:', num, error);
    return String(numValue);
  }
};

export const range = function* range(start, end) {
  for (let i = start; i <= end; i += 1) {
    yield i;
  }
};

export const titleCase = (string) => {
  if (!string || typeof string !== 'string') {
    return '';
  }
  return string
    .toLowerCase()
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
};