import React, { useState, useEffect } from 'react'
import {
  Paper,
  Chip,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Avatar
} from '@material-ui/core'
import {
  Event as EventIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon
} from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import moment from 'moment'
import { useMutation, useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'

import InfoAuthor from './infoAuthor'
import Comment from './comment'
import { useStyles } from './styles'
import { LIKE_AND_UNLIKE_POST, GET_POSTS } from './queries'

import 'react-quill/dist/quill.snow.css'
import '../editor/index.css'
import './index.css'

function PostContent (props) {
  const classes = useStyles()
  const history = useHistory()
  const [state, setState] = useState({ dataPost: null, isLiked: false, likeLoading: false })
  const [likeAndUnlikePost] = useMutation(LIKE_AND_UNLIKE_POST)
  const otherPosts = useQuery(GET_POSTS, {
    variables: {
      limit: 10,
      _id: props.dataPost.createdBy._id,
      offset: 0,
      status: 'PUBLISHED'
    }
  })
  
  useEffect(() => {
    let isLiked = false
    if (props.userProfile && props.dataPost.likedBy.some(obj => obj._id === props.userProfile._id)) {
      isLiked = true
    } else {
      isLiked = false
    }
    setState({ ...state, dataPost: props.dataPost, isLiked })
  }, [props.userProfile])

  const likeAndUnlikeHandler = () => {
    setState({ ...state, likeLoading: true })
    likeAndUnlikePost({
      variables: {
        _id: state.dataPost._id
      }
    }).then(res => {
      if (res.data && res.data.likeAndUnlikePost) {
        const newDataPost = { ...state.dataPost }
        let isLiked = false
        const index = state.dataPost.likedBy.findIndex(obj => obj._id === props.userProfile._id)
        console.log('index', index)
        if (index > -1) {
          newDataPost.likedBy.splice(index, 1)
          isLiked = false
        } else {
          isLiked = true
          newDataPost.likedBy.push({ _id: props.userProfile._id, name: props.userProfile.name })
        }
        setState({ ...state, dataPost: newDataPost, isLiked, likeLoading: false })
      }
    }).catch(err => {
      console.error(err)
      setState({ ...state, likeLoading: false })
    })
  }

  if (!state.dataPost) {
    return <div />
  }

  return (
    <>
      <Paper>
        <div
          className={classes.imagePost}
          style={{
            backgroundImage: `url('${state.dataPost.imageUrlPost}')`
          }}
        >
          <div>
            <h1 className={classes.titlePost}>{state.dataPost.title}</h1>
            <div>
              {state.dataPost.tags.map((tag, index) => <Chip key={index} onClick={() => history.push(`/tag/${tag.title}`)} className={classes.tag} color='primary' label={tag.title} />)}
            </div>
            <div className={classes.createDateWrapper}>
              <EventIcon className={classes.icon} />
              <Typography className={classes.createDate}>
                Ngày đăng: 
                {state.dataPost && moment(state.dataPost.publishedAt).format('DD-MM-YYYY')}
              </Typography>
            </div>
          </div>
        </div>
      </Paper>
      <div className='main-post-container'>
        <Grid container spacing={8}>
          <Grid item xs={12} md={8} lg={8}>
            <Paper className={classes.contentPostWrapper}>
              <div className='ql-container content-container'>
                <div className='summary-content'>{state.dataPost.summary}</div>
                <div className='ql-editor' dangerouslySetInnerHTML={{ __html: state.dataPost.content }} />
              </div>
              <div className={classes.actionWrapper}>
                <IconButton onClick={likeAndUnlikeHandler} disabled={state.likeLoading}>
                  {state.likeLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <FavoriteIcon color={state.isLiked ? 'error' : 'inherit'} />
                  )}
                </IconButton>
                <Typography>
                  {state.dataPost.likedBy.length}
                </Typography>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </div>
              <InfoAuthor author={state.dataPost.createdBy} />
              <Comment idPost={state.dataPost._id} userProfile={props.userProfile} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Paper className={classes.wrapCategory}>
              <Typography className={classes.categoryTitle} component='h2' variant='h6' color='primary' gutterBottom> Cùng tác giả </Typography>
              {otherPosts.loading ? (
                <>
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                </>
              ) : (
                otherPosts.data.postsByUser.map(post => props.dataPost._id !== post._id && (
                  <div key={post._id} className={classes.wrapOtherPost} onClick={() => history.push(`/post/${post._id}`)}>
                    <Avatar className={classes.avatarOtherPost} variant='square' src={post.imageUrlPost} />
                    <Typography className={classes.titleOtherPost} variant='subtitle2' color='textSecondary'>
                      {post.title}
                    </Typography>
                  </div>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default PostContent