import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-apollo'

import PostContent from './postContent'
import { CircularIndeterminate } from '../../components'
import { GET_POST } from './queries'
import { Client } from '../../tools'
import { POST_TAG } from '../../constants'

function Post (props) {
  const { ID } = useParams()
  const [state, setState] = useState({ dataPost: null, isLoading: true })
  const { data, loading, error } = useQuery(GET_POST, {
    variables: {
      _id: ID
    }
  })

  if (loading) {
    return (
      <CircularIndeterminate />
    )
  }

  if (data) {
    const tags = POST_TAG.filter(obj => data.post.tags.includes(obj.value))
    const dataPost = { ...data.post, tags }
    data.post = dataPost
  }

  return (
    <PostContent dataPost={data.post} userProfile={props.userProfile} />
  )
}

export default Post