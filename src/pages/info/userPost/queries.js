import gql from 'graphql-tag'

export const GET_POSTS = gql`
  query ($_id: ID!, $status: String, $tags: String, $limit: Int, $offset: Int, $keyword: String) {
    postsByUser(_id: $_id, status: $status, tags: $tags, limit: $limit, offset: $offset, keyword: $keyword) {
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