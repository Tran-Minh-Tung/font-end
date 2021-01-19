import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Snackbar
} from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { Alert } from '../../../components'
import { useStyles } from './style'
import { CREATE_REPORT } from './queries'

function UserInfo (props) {
  const { userProfile, myId, onFollow } = props

  const classes = useStyles()

  const [reason, setReason] = useState('')
  const [openReportModal, setOpenReportModal] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [success, setSuccess] = useState(false)

  const [createReport] = useMutation(CREATE_REPORT)

  const handleCloseAlert = (e, r) => {
    if (r === 'clickaway') {
      return
    }

    setOpenAlert(false)
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

  const handleCreateReport = () => {
    setOpenReportModal(false)
    createReport({
      variables: {
        input: {
          content: reason,
          type: 'USER',
          idTarget: userProfile._id
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

  const isFollowed = userProfile.followers.some(follower => follower._id === myId)

  return (
    <div className={classes.wrapper}>
      <Paper elevation={10} className={classes.avatarPaper} style={{ marginLeft: '150px' }}>
        <Avatar variant='square' className={classes.avatarLarge} src={`${userProfile.imageUrl}`} />
      </Paper>
      <Paper elevation={5} className={classes.infoUserWrapper}>
        <Typography variant='h4' className={classes.infoUser}>{userProfile.name}</Typography>
        <Typography color='primary' style={{ fontWeight: 'bold', marginTop: 30, marginRight: 5 }} className={classes.infoUser}>Giới thiệu</Typography>
        <Typography className={classes.infoUser}>
          {userProfile.description}
        </Typography>
        <div className={classes.buttonWrapper}>
          {myId === userProfile._id ? null : (
            <Button className={classes.buttonRoot} variant='outlined' color='secondary' onClick={handleOpenReportModal}>Báo cáo vi phạm</Button>
          )}
          {myId === userProfile._id ? null : isFollowed ? (
            <Button className={classes.buttonRoot} variant='contained' color='primary' onClick={onFollow}>Hủy theo dõi</Button>
          ) : (
            <Button className={classes.buttonRoot} variant='contained' color='primary' onClick={onFollow}>Theo dõi</Button>
          )}
        </div>
      </Paper>
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
              label='Người này đã vi phạm gì?'
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
    </div>
  )
}

export default UserInfo