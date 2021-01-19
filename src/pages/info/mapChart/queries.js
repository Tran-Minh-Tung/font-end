import gql from 'graphql-tag'

export const GET_PLACES = gql`
  query ($_id: ID!) {
    placesByUser (_id: $_id) {
      _id
      name
      description
      startAt
      endAt
      albums {
        _id
        name
        images {
          _id
          url
        }
      }
      createdAt
    }
  }
`

export const CREATE_PLACE = gql`
  mutation ($input: CreatePlaceInput!) {
    createPlace (input: $input)
  }
`

export const DELETE_PLACE = gql`
  mutation ($_id: ID!) {
    deletePlace(_id: $_id)
  }
`

export const ADD_ALBUM = gql`
  mutation ($_id: ID!, $albumName: String!) {
    addAlbum(_id: $_id, albumName: $albumName) {
      _id
      name
      description
      startAt
      endAt
      albums {
        _id
        name
        images {
          _id
          url
        }
      }
      createdAt
    }
  }
`

export const REMOVE_ALBUM = gql`
  mutation ($_id: ID!, $idAlbum: ID!) {
    removeAlbum(_id: $_id, idAlbum: $idAlbum)
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

export const REMOVE_IMAGE = gql`
  mutation ($_id: ID!, $idImage: String) {
    removeImage(_id: $_id, idImage: $idImage)
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