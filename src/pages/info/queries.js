import gql from 'graphql-tag'

export const USER = gql`
  query ($_id: ID!) {
    user(_id: $_id) {
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
        imageUrl
        name
        description
      }
      createdAt
    }
  }
`

export const UPDATE_USER = gql`
  mutation($input: UpdateUserInput!, $_id: String) {
    updateUser (input: $input, _id: $_id) {
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
        imageUrl
        description
      }
      createdAt
    }
  }
`
export const FOLLOW_AND_UNFOLLOW = gql`
  mutation ($_id: ID!) {
    followAndUnfollow(_id: $_id)
  }
`