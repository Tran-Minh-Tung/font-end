import React, { useState, useEffect } from 'react'
import { makeStyles, fade } from '@material-ui/core/styles'
import {
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Snackbar
} from '@material-ui/core'
import {
  Home as HomeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  RssFeed as RssFeedIcon,
  Edit as EditIcon
} from '@material-ui/icons'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useMutation } from 'react-apollo'

import MapChart from './mapChart'
import UserInfo from './userInfo'
import UserPost from './userPost'
import Gallery from './gallery'
import Follow from './follow'
import FormModal from './formModal'
import { TabPanel, CircularIndeterminate, Alert } from '../../components'
import { Client } from '../../tools'
import { USER, UPDATE_USER, FOLLOW_AND_UNFOLLOW } from './queries'
import { useStyles } from './styles'
import './index.css'

function Info (props) {
  const param = useParams()
  const classes = useStyles()

  console.log('userProfile', props.userProfile)

  const [value, setValue] = useState(0)
  const [userProfile, setUserProfile] = useState(null)
  const [error, setError] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [updateUser] = useMutation(UPDATE_USER)
  const [followAndUnfollow] = useMutation(FOLLOW_AND_UNFOLLOW)

  useEffect(() => {
    if (param.ID === 'myInfo') {
      setUserProfile(props.userProfile)
    } else {
      Client.query({
        query: USER,
        variables: {
          _id: param.ID
        }
      }).then(res => {
        const { data } = res
        if (data && data.user) {
          setUserProfile(data.user)
        } else {
          setError(true)
        }
      }).catch(err => {
        setError(true)
      })
    }
  }, [param.ID])

  const handleChangeTab = (e, valueTab) => {
    setValue(valueTab)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  const handleUpdateUser = (input) => {
    updateUser({
      variables: {
        input
      }
    }).then(res => {
      const { data } = res
      if (data && data.updateUser) {
        setUserProfile(data.updateUser)
        setOpenModal(false)
        setIsSuccess(true)
        setOpenAlert(true)
      } else {
        setOpenModal(false)
        setIsSuccess(false)
        setOpenAlert(true)
      }
    }).catch(err => {
      console.error(err)
      setOpenModal(false)
      setIsSuccess(false)
      setOpenAlert(true)
    })
  }

  const handleFollowAndUnfollow = () => {
    followAndUnfollow({
      variables: {
        _id: param.ID
      }
    }).then(res => {
      const { data } = res
      if (data && data.followAndUnfollow) {
        const newUserProfile = { ...userProfile }
        const index = newUserProfile.followers.findIndex(follower => follower._id === props.userProfile._id)
        if (index > -1) {
          newUserProfile.followers.splice(index, 1)
        } else {
          newUserProfile.followers.push(props.userProfile)
        }
        setUserProfile(newUserProfile)
      }
    }).catch(err => {
      console.error(err)
    })
  }

  if (error) {
    return (
      <div>Error</div>
    )
  }

  if (!userProfile) {
    return <CircularIndeterminate />
  }

  return (
    <div className='info-container'>
      <UserInfo userProfile={userProfile} myId={props.userProfile._id} onFollow={handleFollowAndUnfollow} />
      <Grid container spacing={8} className={classes.gridContainer}>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.wrapInfo}>
            <div className={classes.titleWrapper}>
              <Typography color='primary' variant='h6' className={classes.titleText} gutterBottom>
                Thông tin chi tiết
              </Typography>
              {userProfile._id === props.userProfile._id && (
                <Tooltip title='Chỉnh sửa thông tin'>
                  <IconButton color='primary' onClick={handleOpenModal}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <div className={classes.infoItem}>
              <PersonIcon color='disabled' className={classes.icon} />
              <Typography>
                Giới tính:&nbsp;
                {userProfile.gender && (userProfile.gender === 'male' ? 'Nam' : 'Nữ')}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <CalendarTodayIcon color='disabled' className={classes.icon} />
              <Typography>
                Ngày sinh:&nbsp;
                {userProfile.birthday ? moment(userProfile.birthday).format('DD-MM-YYYY') : ''}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <HomeIcon color='disabled' className={classes.icon} />
              <Typography>
                Địa chỉ:&nbsp;
                {userProfile.address ? userProfile.address : ''}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <EmailIcon color='disabled' className={classes.icon} />
              <Typography>
                Email:&nbsp;
                {userProfile.email ? userProfile.email : ''}
              </Typography>
            </div>
            <div className={classes.infoItem}>
              <RssFeedIcon color='disabled' className={classes.icon} />
              <Typography>
                Theo dõi bởi&nbsp; 
                {userProfile.followers.length} 
                 &nbsp;người
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <Paper className={classes.wrapContent}>
            <Tabs
              value={value}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleChangeTab}
              aria-label='tab-content'
              variant='scrollable'
            >
              <Tab label='Bài viết đã đăng' />
              <Tab label='Album' />
              <Tab label='Khám phá' />
              <Tab label='Theo dõi' />
            </Tabs>
          </Paper>
          <TabPanel index={0} value={value}>
            <UserPost idUser={userProfile._id} userProfile={props.userProfile} />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <Gallery idUser={userProfile._id} userProfile={props.userProfile} />
          </TabPanel>
          <TabPanel index={2} value={value}>
            <MapChart idUser={userProfile._id} userProfile={props.userProfile} />
          </TabPanel>
          <TabPanel index={3} value={value}>
            <Follow followers={userProfile.followers} />
          </TabPanel>
        </Grid>
      </Grid>
      <FormModal defaultValue={userProfile} open={openModal} onClose={handleCloseModal} onSubmit={handleUpdateUser} />
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {isSuccess
          ? (
            <Alert onClose={handleCloseAlert} severity='success'>
              Cập nhật thành công
            </Alert>
          ) : (
            <Alert onClose={handleCloseAlert} severity='error'>
              Xảy ra lỗi!!!
            </Alert>
          )}
      </Snackbar>
    </div>
  )
}

export default Info