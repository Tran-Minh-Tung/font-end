import { makeStyles } from '@material-ui/styles'

export const useStyles = makeStyles(theme => ({
  formWapper: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paperEditor: {
    borderRadius: 10,
    margin: 10,
    height: 'calc(100% - 100px)'
  },
  paperInputWrapper: {
    borderRadius: 10,
    margin: 10,
    display: 'flex',
    justifyContent: 'center'
  },
  inputRoot: {
    background: '#fff',
    margin: 8,
    width: '100%'
  },
  formControlRoot: {
    width: '100%',
    maxWidth: '100%'
  },
  chipRoot: {
    marginLeft: 2,
    marginRight: 2,
    color: '#fff'
  },
  checked: {
    color: '#6cd3f0'
  },
  buttonRoot: {
    margin: 10
  },
  helperText: {
    color: '#f44336',
    // margin: 0,
    fontSize: '0.75rem',
    marginTop: '3px',
    textAlign: 'left',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    marginLeft: '14px',
    marginRight: '14px'
  },
  rootCard: {
    width: '45%',
    margin: 8
  },
  imageCard: {
    display: 'flex',
    justifyContent: 'center'
  },
  textCard: {
    display: 'flex',
    justifyContent: 'center'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))