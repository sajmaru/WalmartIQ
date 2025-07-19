import { makeStyles } from '@material-ui/styles';

const useHorizontalListStyles = makeStyles({
  parent: ({ before, after, spacing = '0.5rem', style = {} }) => ({
    ...style,
    display: 'flex',
    flexDirection: 'row',
    '& > *:not(:first-child)': {
      marginLeft: spacing,
    },
    '& > *:first-child': {
      marginLeft: before,
    },
    '& > *:last-child': {
      marginRight: after,
    },
  }),
});

export default useHorizontalListStyles;
