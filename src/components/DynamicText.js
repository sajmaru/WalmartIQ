import useRouting from '../routes/useRouting';
import useConstants from '../hooks/useConstants';

const DynamicText = ({ children }) => {
  const { LATEST_YEAR } = useConstants();
  const { year = LATEST_YEAR } = useRouting();
  return children + (year > 2019 ? '(P)' : '');
};

export default DynamicText;
