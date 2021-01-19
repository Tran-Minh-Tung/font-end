import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
  cardMedia: {
    height: 148
  }
}))

export default function FollowCard (props) {
  const classes = useStyles()

  const { follower } = props
  console.log('follower', follower)

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cardMedia}
        image={follower.imageUrl}
        title={follower.name}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {follower.name}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p' noWrap>
          {follower.description}
        </Typography>
      </CardContent>
    </Card>
  )
}