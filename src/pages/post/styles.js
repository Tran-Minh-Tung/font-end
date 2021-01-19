import { makeStyles, fade } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  titlePost: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 26,
    margin: 14,
    display: 'flex',
    justifyContent: 'center'
  },
  imagePost: {
    backgroundSize: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 14,
    width: '100%',
    height: 400,    
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  tag: {
    margin: 12,
    cursor: 'pointer'
  },
  createDateWrapper: {
    display: 'flex',
    margin: '12px 12px 16px 12px'
  },
  icon: {
    color: '#fff'
  },
  createDate: {
    color: '#fff',
    marginLeft: 12
  },
  wrapCategory: {
    padding: 20,
    marginTop: 10,
    marginBottom: 20
  },
  contentPostWrapper: {
    padding: 12
  },
  actionWrapper: {
    maxWidth: '40%',
    display: 'flex',
    alignItems: 'center'
  },
  backDrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  authorWrapper: {
    marginTop: 12,
    marginBottom: 12,
    border: '1px solid #4287f5',
    borderRadius: 5,
    padding: 12,
    display: 'flex'
  },
  avatarLarge: {
    height: 82,
    width: 82,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  authorAvatar: {
    margin: 12
  },
  authorContent: {
    margin: 12
  },
  authorTotalPostWrapper: {
    display: 'flex',
    margin: 12,
    height: 12,
    alignItems: 'center'
  },
  authorTotalPostText: {
    fontSize: '0.8em'
  },
  divider: {
    marginLeft: 8,
    marginRight: 8
  },
  commentWrapper: {
    marginTop: 16,
    marginBottom: 16
  },
  inputCommentWrapper: {
    display: 'flex',
    margin: 12,
    marginBottom: 32
  },
  avatarComment: {
    marginLeft: 8,
    marginRight: 8
  },
  contentCommentWrapper: {
    paddingLeft: 12,
    background: '#e3e8e5',
    borderRadius: 10,
    width: '100%'
  },
  actionComment: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  wrapOtherPost: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  avatarOtherPost: {
    margin: 8
  },
  titleOtherPost: {
    margin: 8
  }
}))