import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation ($input: LoginUserInput!) {
    login (input: $input) {
      accessToken
    }
  }
`

export const REGISTER = gql`
  mutation ($input: CreateUserInput!) {
    register (input: $input)
  }
`

export const ME = gql`
  query {
    me {
      _id
      name
      gender
      birthday
      email
      description
      address
      imageUrl
      followers {
        _id
        name
        description
      }
      createdAt
    }
  }
`