import { makeStyles, fade } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  wrapContent: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  },
  wrapAuthor: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  avatarAuthor: {
    margin: 8
  },
  nameAuthor: {
    margin: 8
  },
  wrapCategory: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main
    }
  },
  iconCategory: {
    margin: 4
  },
  nameCategory: {
    margin: 4
  },
  searchTitle: {
    display: 'flex',
    margin: 12
  }
}))