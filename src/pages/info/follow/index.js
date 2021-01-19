import React from 'react'
import {
  GridList,
  GridListTile,
  Paper,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import FollowerCard from './followerCard'

const useStyles = makeStyles(theme => ({
  paperWrapper: {
    marginTop: 12,
    width: '100%',
    padding: 12
  },
  gridListRoot: {
    padding: 15
  },
  root: {
    maxWidth: 345
  },
  gridListTile: {
    // boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    cursor: 'pointer'
  }
}))

function Follow (props) {
  const classes = useStyles()
  const history = useHistory()

  const { followers } = props

  if (followers.length === 0) {
    return (
      <Paper className={classes.paperWrapper}>
        <Typography align='center'>
          Chưa có ai theo dõi
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paperWrapper}>
      <GridList
        className={classes.gridListRoot}
        cellHeight={250}
        cols={3}
        spacing={6}
      >
        {followers.map(follower => (
          <GridListTile key={follower._id} className={classes.gridListTile} onClick={() => history.push(`/info/${follower._id}`)}>
            <FollowerCard follower={follower} />
          </GridListTile>
        ))}
      </GridList>
    </Paper>
  )
}

export default Follow