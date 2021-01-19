import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography
} from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import { CircularIndeterminate, SkeletonComponent, PostPreview } from '../../../components'
import { Client } from '../../../tools'
import { GET_POSTS } from './queries'
import { useStyles } from './styles'

// mỗi lần query 10 bài
const limit = 10

function UserPost (props) {
  const classes = useStyles()
  const [items, setItems] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const getUserPost = (_id, page = 0) => {
    Client.query({
      query: GET_POSTS,
      variables: {
        _id,
        limit,
        offset: page * limit,
        status: 'PUBLISHED'
      }
    }).then(res => {
      if (res.data && res.data.postsByUser) {
        if (!items) {
          setItems([...res.data.postsByUser])
        } else {
          setItems([...items, ...res.data.postsByUser])
        }
        if (res.data.postsByUser.length < limit) {
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
    getUserPost(props.idUser)
  }, [])

  const loadItem = (page) => {
    getUserPost(props.idUser, page)
  }

  if (!items) {
    return (
      <Paper className={classes.paperWrapper}>
        <CircularIndeterminate />
      </Paper>
    )
  }

  if (items.length === 0) {
    return (
      <Paper className={classes.paperWrapper}>
        <Typography align='center'>
          Chưa có bài viết nào
        </Typography>
      </Paper>
    )
  }

  return (
    <div>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadItem}
        hasMore={hasMore}
        loader={<SkeletonComponent />}
        threshold={350}
      >
        {items.map((item) => <PostPreview key={item._id} userProfile={props.userProfile} postInfo={item} />)}
      </InfiniteScroll>
    </div>
  )
}

export default UserPost
