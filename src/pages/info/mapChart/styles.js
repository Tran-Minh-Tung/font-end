import { makeStyles, fade } from '@material-ui/core/styles'

const drawerWidth = '50%'

export const useStyles = makeStyles(theme => ({
  paperWrapper: {
    marginTop: 12,
    width: '100%',
    padding: 12
  },
  descriptionInput: {
    marginTop: 16,
    marginBottom: 8
  },
  dateInput: {
    width: '100%'
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX: 'hidden'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  info: {
    marginLeft: theme.spacing(2),
    flex: 1,
    marginBottom: theme.spacing(1)
  },
  buttonWrapper: {
    position: 'relative'
  },
  buttonProgressClose: {
    color: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  iconRoot: {
    fontSize: 50,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    height: 'calc(100% - 48px)'
  },
  gridListRoot: {
    padding: 15,
    textAlign: 'center'
  },
  gridListShift: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    width: '50%'
  },
  gridListTileRoot: {
    // boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    position: 'relative'
  },
  gridListTile: {
    background: fade('#000', 0.1)
  },
  buttonClose: {
    color: '#fff',
    position: 'absolute',
    top: '0%',
    left: '100%',
    marginLeft: -42,
    marginTop: -4
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000
  },
  progressWrapper: {
    width: '80%'
  },
  imageTitleWrapper: {
    padding: 12
  }
}))