import { useCallback, useContext } from 'react';
import { ConstantsContext } from '../context/Constants';

const useMap = () => {
  const { state, setState } = useContext(ConstantsContext);

  const setConstant = useCallback(
    (name, value) => {
      setState((oldState) => ({ ...oldState, [name]: value }));
    },
    [setState],
  );

  return {
    ...state,
    setConstant,
  };
};

export default useMap;
