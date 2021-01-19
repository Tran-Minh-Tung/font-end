/* eslint-disable */
import React from 'react'
import __ from 'lodash'
import { LinearIndeterminate } from '../process'
import Loadable from 'react-loadable'

const LoadableComponent = (importComponent, ownProps) => Loadable({
  loader: () => importComponent,
  loading: LinearIndeterminate,
  delay: 1000,
  render: (loaded, props) => {
    props = Object.assign(__.cloneDeep(props), ownProps)
    let Component = loaded.default
    return <Component {...props} />
  }
})

export { LoadableComponent }
