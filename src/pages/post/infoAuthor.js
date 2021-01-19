import React from 'react'
import {
  Typography,
  Avatar,
  Divider
} from '@material-ui/core'
import { useQuery } from 'react-apollo'
import { GET_INFO_AUTHOR } from './queries'
import { useStyles } from './styles'

const InfoAuthor = (props) => {
  const classes = useStyles()
  const infoAuthor = useQuery(GET_INFO_AUTHOR, {
    variables: {
      _id: props.author._id
    }
  })

  return (
    <div className={classes.authorWrapper}>
      <div className={classes.authorAvatar}>
        <Avatar className={classes.avatarLarge} src={props.author.imageUrl} />
        <div className={classes.authorTotalPostWrapper}>
          <p className={classes.authorTotalPostText}>
            {!infoAuthor.loading && infoAuthor.data.numberOfPlace}
            &nbsp;tỉnh thành
          </p>
          <Divider orientation='vertical' className={classes.divider} />
          <p className={classes.authorTotalPostText}>
            {!infoAuthor.loading && infoAuthor.data.numberOfPost}
            &nbsp;bài viết
          </p>
        </div>
      </div>
      <div className={classes.authorContent}>
        <Typography variant='h4'>
          {props.author.name}
        </Typography>
        <Typography variant='caption'>
          {props.author.description}
        </Typography>
      </div>
    </div>
  )
}

export default InfoAuthor