import { makeStyles, fade } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: 30,
    height: 400
  },
  avatarPaper: {
    width: theme.spacing(30),
    height: theme.spacing(42),
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(20),
      height: theme.spacing(37),
      position: 'relative',
      right: '50px'
    },
    borderRadius: 10,
    zIndex: 1
  },
  avatarLarge: {
    width: theme.spacing(30),
    height: theme.spacing(42),
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(20),
      height: theme.spacing(37)
    },
    borderRadius: 10
  },
  iconRoot: {
    marginRight: theme.spacing(1)
  },
  buttonRoot: {
    marginLeft: theme.spacing(2)
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: '5%',
    right: '5%'
  },
  infoUserWrapper: {
    position: 'relative',
    // width: '600px',
    height: 'fit-content',
    top: '50px',
    right: '150px',
    minHeight: theme.spacing(42),
    maxHeight: '348px',
    background: fade(theme.palette.background.default, 0.9),
    // height: theme.spacing(42),
    width: '65%',
    [theme.breakpoints.down('md')]: {
      right: '110px',
      width: '100%'
    }
  },
  infoUser: {
    marginLeft: theme.spacing(21),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: '100vh',
    minHeight: '6vh',
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(10)
    }
  }
}))