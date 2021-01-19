import React from 'react'
import { Fab } from '@material-ui/core'
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@material-ui/icons'

import { ScrollTop } from './scrollTop'

function BackToTop (props) {
  return (
    <ScrollTop {...props}>
      <Fab color='primary' size='small' aria-label='scroll back to top'>
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollTop>
  )
}

export { BackToTop }
