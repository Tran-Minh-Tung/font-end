import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: 12,
    padding: 12
  },
  media: {
    height: 0,
    paddingTop: '40%' // 16:9
  },
  title: {
    textTransform: 'capitalizea'
  },
  actionWrapper: {
    maxWidth: '40%',
    display: 'flex',
    alignItems: 'center'
  },
  cardContent: {
    cursor: 'pointer'
  },
  cardHeader: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))