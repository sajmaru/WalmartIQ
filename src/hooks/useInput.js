import { useState, useCallback } from 'react';

const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return {
    value,
    setValue,
    bind: {
      value,
      onChange,
    },
  };
};

export default useInput;
