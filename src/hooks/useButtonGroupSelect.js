import { useState, useCallback } from 'react';

const useButtonGroupSelect = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const bind = useCallback(
    (buttonValue) => ({
      onClick: () => setValue(buttonValue),
    }),
    [],
  );

  return {
    value,
    setValue,
    bind,
  };
};

export default useButtonGroupSelect;
