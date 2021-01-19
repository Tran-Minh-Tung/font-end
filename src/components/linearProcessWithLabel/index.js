import React from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  Box,
  Typography,
  LinearProgress
} from '@material-ui/core'

function LinearProgressWithLabel (props) {
  return (
    <>
      <Paper style={{ padding: 12 }}>
        <Typography>Đang tải ảnh lên...</Typography>
        <Box display='flex' alignItems='center'>
          <Box width='100%' mr={1}>
            <LinearProgress variant='determinate' {...props} />
          </Box>
          <Box minWidth={35}>
            <Typography variant='body2' color='textSecondary'>
              {`${Math.round(
                props.value
              )}%`}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  )
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired
}

export { LinearProgressWithLabel }