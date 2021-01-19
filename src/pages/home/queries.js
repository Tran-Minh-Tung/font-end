import gql from 'graphql-tag'

export const GET_POSTS = gql`
  query ($status: String, $tags: String, $limit: Int, $offset: Int, $keyword: String) {
    posts(status: $status, tags: $tags, limit: $limit, offset: $offset, keyword: $keyword) {
      _id
      title
      summary
      imageUrlPost
      createdBy {
        _id
        name
        imageUrl
      }
      likedBy {
        _id
      }
      publishedAt
    }
  }
`

export const GET_HIGHEST_POSTS = gql`
  query {
    userHighestPost {
      _id
      name
      imageUrl
    }
  }
`