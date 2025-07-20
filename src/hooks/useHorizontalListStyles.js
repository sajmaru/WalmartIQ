import { makeStyles } from '@mui/styles';

const useHorizontalListStyles = makeStyles({
  parent: ({ before, after, spacing = '0.5rem', style = {} }) => ({
    ...style,
    display: 'flex',
    flexDirection: 'row',
    '& > *:not(:first-of-type)': {
      marginLeft: spacing,
    },
    '& > *:first-of-type': {
      marginLeft: before,
    },
    '& > *:last-child': {
      marginRight: after,
    },
  }),
});

export default useHorizontalListStyles;
