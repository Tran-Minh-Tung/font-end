import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  textInput: {
    marginTop: 16,
    marginBottom: 8
  },
  gridContainer: {
    width: '73%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  icon: {
    marginRight: 12,
    float: 'left'
  },
  wrapInfo: {
    padding: 12
  },
  infoItem: {
    marginBottom: 8
  },
  wrapContent: {
    padding: 12,
    width: '100%'
  },
  dateInput: {
    width: '100%'
  },
  titleWrapper: {
    display: 'flex'
  },
  titleText: {
    display: 'flex',
    alignItems: 'center',
    flex: 'auto'
  },
  formControl: {
    width: '100%',
    marginTop: 16,
    marginBottom: 8
  }
}))