import { makeStyles } from '@material-ui/styles';

const useVerticalListStyles = makeStyles({
  parent: ({ before, after, spacing = '0.5rem', style = {} }) => ({
    ...style,
    '& > *:not(:first-child)': {
      marginTop: spacing,
    },
    '& > *:first-child': {
      marginTop: before,
    },
    '& > *:last-child': {
      marginBottom: after,
    },
  }),
});

export default useVerticalListStyles;
