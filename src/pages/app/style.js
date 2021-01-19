import { makeStyles, fade } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: fade(theme.palette.primary.main, 0.7)
  },
  loginButton: {
    borderColor: '#fff',
    color: '#fff',
    '&:hover': {
      color: '#0499d9',
      background: 'transparent',
      borderColor: '#0499d9'
    },
    [theme.breakpoints.down('sm')]: {
      width: 48,
      fontSize: 7
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.4),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.2)
    },
    marginLeft: 0,
    marginRight: 30,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(1),
      width: '40%'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: fade(theme.palette.common.black, 0.7)
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 300
      }
    }
  },
  navBar: {
    flexGrow: 2
  },
  linkRoot: {
    marginRight: 10,
    marginLeft: 10,
    color: '#fff'
  },
  title: {
    textTransform: 'uppercase',
    color: '#fff',
    marginTop: theme.spacing(3)
  },
  bodyText: {
    width: '100%'
  },
  paper: {
    background: 'rgba(255,255,255,0.9)'
  },
  cardRoot: {
    height: '100%'
  },
  cardMediaRoot: {
    height: '100%'
  },
  cardActionMediaRoot: {
    height: '100%'
  },
  cardContent: {
    color: '#fff',
    fontSize: 50,
    position: 'absolute',
    top: '50%',
    [theme.breakpoints.down('md')]: {
      fontSize: 40,
      top: '60%'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      top: '70%'
    }
  },
  drawer: {
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
}))