import gql from 'graphql-tag'

export const LIKE_AND_UNLIKE_POST = gql`
  mutation($_id: ID!) {
    likeAndUnlikePost(_id: $_id)
  }
`

export const CREATE_REPORT = gql`
  mutation($input: ReportInput!) {
    createReport(input: $input)
  }
`