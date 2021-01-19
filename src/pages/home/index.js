import React, { useState, useEffect, useContext } from 'react'
import {
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip
} from '@material-ui/core'
import {
  Home as HomeIcon,
  Room as RoomIcon,
  Fastfood as FastfoodIcon,
  FlightTakeoff as FlightTakeoffIcon
} from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import { useParams, useHistory } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import { useQuery } from 'react-apollo'

import { Client, AuthContext } from '../../tools'
import { GET_POSTS, GET_HIGHEST_POSTS } from './queries'
import { useStyles } from './style'
import { PostPreview, SkeletonComponent, CircularIndeterminate } from '../../components'
import './index.css'

const limit = 10

function Home (props) {
  const classes = useStyles()
  const context = useContext(AuthContext)
  const params = useParams()
  const history = useHistory()

  const highestPost = useQuery(GET_HIGHEST_POSTS)

  const [items, setItems] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const getUserPost = (page = 0) => {
    Client.query({
      query: GET_POSTS,
      variables: {
        limit,
        offset: page * limit,
        status: 'PUBLISHED',
        keyword: params.keyword || null,
        tags: params.tag || null
      }
    }).then(res => {
      if (res.data && res.data.posts) {
        console.log(items)
        if (!items) {
          setItems(res.data.posts)
        } else {
          setItems([...items, ...res.data.posts])
        }

        if (res.data.posts.length < limit) {
          setHasMore(false)
        }
      } else {
        setHasMore(false)
      }
    }).catch(err => {
      console.log(err)
      setHasMore(false)
    })
  }

  useEffect(() => {
    setItems(null)
    getUserPost()
  }, [params])

  const loadItem = (page) => {
    getUserPost(page)
  }

  const changeRoute = (path) => {
    setItems(null)
    history.push(path)
  }

  const myId = context.state.userProfile && context.state.userProfile._id

  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={12} md={2} lg={2}>
          <Paper className={classes.wrapContent}>
            <div className={classes.wrapCategory} onClick={() => changeRoute('/')}>
              <HomeIcon color='primary' className={classes.iconCategory} />
              <Typography className={classes.nameCategory} variant='subtitle1' color='primary' gutterBottom> Trang chủ </Typography>
            </div>
            <div className={classes.wrapCategory} onClick={() => changeRoute('/tag/ăn uống')}>
              <FastfoodIcon color='primary' className={classes.iconCategory} />
              <Typography className={classes.nameCategory} variant='subtitle1' color='primary' gutterBottom> Ăn uống </Typography>
            </div>
            <div className={classes.wrapCategory} onClick={() => changeRoute('/tag/địa điểm')}>
              <RoomIcon color='primary' className={classes.iconCategory} />
              <Typography className={classes.nameCategory} variant='subtitle1' color='primary' gutterBottom> Địa điểm </Typography>
            </div>
            <div className={classes.wrapCategory} onClick={() => changeRoute('/tag/du lịch')}>
              <FlightTakeoffIcon color='primary' className={classes.iconCategory} />
              <Typography className={classes.nameCategory} variant='subtitle1' color='primary' gutterBottom> Du lịch</Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {params.keyword && (
            <Typography variant='h6' className={classes.searchTitle}>
              Kết quả tìm kiếm với từ khóa:&nbsp;
              <Typography variant='h6' color='primary'>
                {params.keyword}
              </Typography>
            </Typography>
          )}
          {params.tag && (
            <Typography variant='h6' className={classes.searchTitle}>
              Kết quả tìm kiếm với tag:&nbsp;
              <Chip label={params.tag} color='primary' />
            </Typography>
          )}
          {!items ? (
            <CircularIndeterminate />
          ) : items.length === 0 ? (
            <Typography align='center'>
              Không có kết quả
            </Typography>
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={loadItem}
              hasMore={hasMore}
              loader={<SkeletonComponent key={0} />}
              threshold={350}
            >
              {items.map((item) => <PostPreview key={item._id} userProfile={props.userProfile} postInfo={item} />)}
            </InfiniteScroll>
          )}
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.wrapContent}>
            <Typography variant='h6' color='primary' component='h2' gutterBottom>Những người đóng góp nhiều nhất</Typography>
            {highestPost.loading ? (
              <div>
                <Skeleton animation='wave' />
                <Skeleton animation='wave' />
                <Skeleton animation='wave' />
                <Skeleton animation='wave' />
                <Skeleton animation='wave' />
              </div>
            ) : (
              highestPost.data.userHighestPost.map(user => (
                <div className={classes.wrapAuthor} onClick={() => history.push(`/info/${user._id}`)}>
                  <Avatar className={classes.avatarAuthor} src={user.imageUrl} />
                  <Typography className={classes.nameAuthor} variant='subtitle2' color='textSecondary'>
                    {user.name}
                  </Typography>
                </div>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default Home
