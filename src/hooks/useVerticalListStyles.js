import { makeStyles } from '@mui/styles';

const useVerticalListStyles = makeStyles({
  parent: ({ before, after, spacing = '0.5rem', style = {} }) => ({
    ...style,
    '& > *:not(:first-of-type)': {
      marginTop: spacing,
    },
    '& > *:first-of-type': {
      marginTop: before,
    },
    '& > *:last-child': {
      marginBottom: after,
    },
  }),
});

export default useVerticalListStyles;
