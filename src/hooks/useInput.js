import { useState, useCallback } from 'react';

const useInput = (initialValue = '') => {
  // Ensure initialValue is never undefined or null
  const safeInitialValue = initialValue ?? '';
  const [value, setValue] = useState(safeInitialValue);

  const onChange = useCallback((event) => {
    const newValue = event.target.value;
    // Ensure value is never undefined
    setValue(newValue ?? '');
  }, []);

  const setValueSafe = useCallback((newValue) => {
    // Ensure value is never undefined
    setValue(newValue ?? '');
  }, []);

  return {
    value: value ?? '', // Double-check value is never undefined
    setValue: setValueSafe,
    bind: {
      value: value ?? '', // Double-check for the bind object too
      onChange,
    },
  };
};

export default useInput;