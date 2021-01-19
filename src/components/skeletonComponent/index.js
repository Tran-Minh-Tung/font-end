import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    marginTop: 12,
    padding: 12
  },
  media: {
    height: 0,
    paddingTop: '40%' // 16:9
  }
}))

function SkeletonComponent (props) {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Skeleton animation='wave' variant='circle' width={40} height={40} />}
        action={null}
        title={<Skeleton animation='wave' height={10} width='80%' style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation='wave' height={10} width='40%' />}
      />
      <Skeleton animation='wave' variant='rect' className={classes.media} />
      <CardContent>
        <div>
          <Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation='wave' height={10} width='80%' />
        </div>
      </CardContent>
    </Card>
  )
}

export { SkeletonComponent }