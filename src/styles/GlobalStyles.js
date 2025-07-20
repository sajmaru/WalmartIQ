import { GlobalStyles } from '@mui/material';

const CustomGlobalStyles = () => (
  <GlobalStyles
    styles={{
      // Fix emotion CSS warnings by replacing :first-of-type with :first-of-type
      '& > *:not(:first-of-type)': {
        marginLeft: '16px !important',
      },
      '& > *:first-of-type': {
        marginLeft: 0,
      },
      '& > *:last-child': {
        marginRight: 0,
      },
      // Additional global fixes
      '.MuiBox-root > *:not(:first-of-type)': {
        marginLeft: 16,
      },
    }}
  />
);

export default CustomGlobalStyles;