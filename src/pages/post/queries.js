import gql from 'graphql-tag'

export const GET_POST = gql`
  query($_id: ID!) {
    post(_id: $_id) {
      _id
      title
      content
      summary
      tags
      imageUrlPost
      publishedAt
      likedBy {
        _id
        name
      }
      createdBy {
        _id
        name
        description
        imageUrl
        followers {
          _id
        }
      }
    }
  }
`

export const GET_INFO_AUTHOR = gql`
  query ($_id: ID!) {
    numberOfPlace(_id: $_id)
    numberOfPost: numberOfPostByUser(_id: $_id)
  }
`

export const LIKE_AND_UNLIKE_POST = gql`
  mutation($_id: ID!) {
    likeAndUnlikePost(_id: $_id)
  }
`

export const GET_COMMENTS = gql`
  query ($idPost: ID!, $limit: Int!, $offset: Int!) {
    comments(idPost: $idPost, limit: $limit, offset: $offset) {
      _id
      content
      commentBy {
        _id
        name
        imageUrl
      }
      createdAt
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation ($input: CommentInput!) {
    createComment(input: $input) {
      _id
      content
      commentBy {
        _id
        name
        imageUrl
      }
      createdAt
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation ($_id: ID!) {
    deleteComment (_id: $_id)
  }
`

export const UPDATE_COMMENT = gql`
  mutation ($_id: ID!, $input: CommentInput!) {
    updateComment (_id: $_id, input: $input) {
      _id
      content
      commentBy {
        _id
        name
        imageUrl
      }
      createdAt
    }
  }
`
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