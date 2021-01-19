import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Avatar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  CardActions,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  DialogTitle,
  Snackbar
} from '@material-ui/core'
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Report as ReportIcon
} from '@material-ui/icons'
import moment from 'moment'
import { useMutation } from 'react-apollo'
import { Alert } from '../alert'
import { useStyles } from './styles'
import { LIKE_AND_UNLIKE_POST, CREATE_REPORT } from './queries'

function PostPreview (props) {
  const { postInfo, userProfile } = props

  const classes = useStyles()
  const history = useHistory()

  const [likeAndUnlikePost] = useMutation(LIKE_AND_UNLIKE_POST)
  const [createReport] = useMutation(CREATE_REPORT)

  const [isLiked, setIsLiked] = useState(userProfile && postInfo.likedBy.some(obj => obj._id === userProfile._id))
  const [loading, setLoading] = useState(false)
  const [openAlertModal, setOpenAlertModal] = useState(false)
  const [reason, setReason] = useState('')
  const [openReportModal, setOpenReportModal] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLikeAndUnlike = () => {
    setLoading(true)
    likeAndUnlikePost({
      variables: {
        _id: postInfo._id
      }
    }).then(res => {
      const { data } = res
      if (data && data.likeAndUnlikePost) {
        if (isLiked) {
          const index = postInfo.likedBy.findIndex(ele => ele._id === userProfile._id)
          postInfo.likedBy.splice(index, 1)
        } else {
          postInfo.likedBy.push(userProfile)
        }
        setIsLiked(!isLiked)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  const handleOpenAlertModal = () => {
    setOpenAlertModal(true)
  }

  const handleCloseAlertModal = () => {
    setOpenAlertModal(false)
  }

  const handleOpenReportModal = () => {
    setOpenReportModal(true)
  }

  const handleCloseReportModal = () => {
    setOpenReportModal(false)
  }

  const handleChangeReason = (e) => {
    setReason(e.target.value)
  }

  const handleCloseAlert = (e, r) => {
    if (r === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }
  
  const handleCreateReport = () => {
    setOpenReportModal(false)
    createReport({
      variables: {
        input: {
          content: reason,
          type: 'POST',
          idTarget: postInfo._id
        }
      }
    }).then(res => {
      const { data } = res
      if (data && data.createReport) {
        setOpenAlert(true)
        setSuccess(true)
        setReason('')
      } else {
        setOpenAlert(true)
        setSuccess(false)
        setReason('')
      }
    })
  }

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label='recipe' src={postInfo.createdBy.imageUrl} />
          }
          title={postInfo.createdBy.name}
          subheader={`${moment(postInfo.publishedAt).format('DD-MM-YYYY')} lúc ${moment(postInfo.publishedAt).format('hh:mm')}`}
          onClick={() => history.push(`/info/${postInfo.createdBy._id}`)}
        />
        <CardMedia
          className={classes.media}
          image={postInfo.imageUrlPost}
          title={postInfo.title}
          onClick={() => history.push(`/post/${postInfo._id}`)}
        />
        <CardContent className={classes.cardContent} onClick={() => history.push(`/post/${postInfo._id}`)}>
          <Typography variant='h6' gutterBottom>
            {postInfo.title}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p' paragraph>
            {postInfo.summary}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title='Thích'>
            <IconButton aria-label='like' disabled={loading} onClick={userProfile ? handleLikeAndUnlike : handleOpenAlertModal}>
              {loading ? <CircularProgress size={24} /> : <FavoriteIcon color={isLiked ? 'error' : 'inherit'} />}
            </IconButton>
          </Tooltip>
          <Typography>
            {postInfo.likedBy.length}
          </Typography>
          <Tooltip title='Chia sẻ'>
            <IconButton aria-label='share'>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Báo cáo'>
            <IconButton aria-label='report' onClick={userProfile ? handleOpenReportModal : handleOpenAlertModal}>
              <ReportIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
      <Dialog
        open={openAlertModal}
        onClose={handleCloseAlertModal}
      >
        <DialogContent>
          <DialogContentText>
            Bạn phải đăng nhập để thực hiện chức năng này
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleCloseAlertModal}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReportModal}
        onClose={handleCloseReportModal}
        fullWidth
      >
        <DialogTitle>Báo cáo vi phạm</DialogTitle>
        <DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label='Bài viết này đã vi phạm gì?'
              variant='outlined'
              value={reason}
              onChange={handleChangeReason}
            />
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button color='primary' disabled={reason === ''} onClick={handleCreateReport}>
            OK
          </Button>
          <Button color='primary' onClick={handleCloseReportModal}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {success
          ? (
            <Alert onClose={handleCloseAlert} severity='success'>
              Báo cáo của bạn đã được ghi lại
            </Alert>
          ) : (
            <Alert onClose={handleCloseAlert} severity='error'>
              Lỗi!!!Thao tác không thành công
            </Alert>
          )}
      </Snackbar>
    </>
  )
}

export { PostPreview }