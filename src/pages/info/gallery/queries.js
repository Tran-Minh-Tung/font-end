import gql from 'graphql-tag'

export const GET_ALBUMS = gql`
  query ($_id: ID!) {
    albumsByUser (_id: $_id) {
      _id
      name
      images {
        _id
        url
      }
      createdAt
    }
  }
`

export const CREATE_ALBUM = gql`
  mutation ($name: String!) {
    createAlbum(name: $name) {
      _id
      name
      images {
        _id
        url
      }
    }
  }
`

export const DELETE_ALBUM = gql`
  mutation ($_id: ID!) {
    deleteAlbum(_id: $_id)
  }
`

export const ADD_IMAGE = gql`
  mutation ($_id: ID!, $imageUrl: String) {
    addImage(_id: $_id, imageUrl: $imageUrl) {
      _id
      name
      images {
        _id
        url
      }
    }
  }
`

export const ADD_MULTI_IMAGE = gql`
  mutation ($_id: ID!, $imageUrls: [String]) {
    addMultiImage(_id: $_id, imageUrls: $imageUrls) {
      _id
      name
      images {
        _id
        url
      }
    }
  }
`

export const REMOVE_IMAGE = gql`
  mutation ($_id: ID!, $idImage: String) {
    removeImage(_id: $_id, idImage: $idImage)
  }
`