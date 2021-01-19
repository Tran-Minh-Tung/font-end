import gql from 'graphql-tag'

export const CREATE_REPORT = gql`
  mutation($input: ReportInput!) {
    createReport(input: $input)
  }
`