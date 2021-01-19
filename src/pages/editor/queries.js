import gql from 'graphql-tag'

export const CREATE_POST = gql`
  mutation ($input: PostInput!) {
    createPost(input: $input)
  }
`