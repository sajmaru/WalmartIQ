export const readableNumber = (num, fixed = 1) => {
  if (num === null) return null;
  if (num === 0) return '0';
  const b = num.toPrecision(2).split('e');
  const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3);
  const c =
    k < 1 ? num.toFixed(0 + fixed) : (num / 10 ** (k * 3)).toFixed(1 + fixed);
  return c < 0 ? c : Math.abs(c) + ['', 'K', 'M', 'B', 'T'][k];
};

export const range = function* range(start, end) {
  for (let i = start; i <= end; i += 1) {
    yield i;
  }
};

export const titleCase = (string) =>
  string
    .toLowerCase()
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
