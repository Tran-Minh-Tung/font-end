import { makeStyles, fade } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  paperWrapper: {
    marginTop: 12,
    width: '100%',
    padding: 12
  },
  gridListRoot: {
    padding: 15,
    textAlign: 'center'
  },
  iconRoot: {
    fontSize: 50,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    height: 'calc(100% - 48px)'
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
  nameAlbum: {
    marginLeft: theme.spacing(2),
    flex: 1,
    marginBottom: theme.spacing(1)
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000
  },
  progressWrapper: {
    width: '80%'
  },
  paperDialog: {
    overflowX: 'hidden'
  }
}))