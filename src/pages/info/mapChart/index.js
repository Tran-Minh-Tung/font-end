import React, { useState } from 'react'
import { geoCylindricalStereographic } from 'd3-geo-projection'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps'
import {
  Paper
} from '@material-ui/core'
import { useQuery, useMutation } from 'react-apollo'
import { CircularIndeterminate } from '../../../components'
import FormModal from './formModal'
import PreviewPlace from './previewPlace'
import { GET_PLACES, DELETE_PLACE } from './queries'
import { useStyles } from './styles'

// const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'
const geoUrl = '/json-map/Dia_phan_Tinh.json'

const MapChart = (props) => {
  const classes = useStyles()
  const { loading, error, data, refetch } = useQuery(GET_PLACES, {
    variables: {
      _id: props.idUser
    }
  })

  const [deletePlace] = useMutation(DELETE_PLACE)
  const [state, setState] = useState({ openModal: false, placeDefault: '', openDialog: false, place: null })

  const handleCloseModal = () => {
    setState({ ...state, openModal: false })
  }

  const handleopenModal = (name) => {
    setState({ ...state, openModal: true, placeDefault: name })
  }

  const handleOpenDialog = (place) => {
    setState({ ...state, openDialog: true, place })
  }

  const handleCloseDialog = () => {
    setState({ ...state, openDialog: false })
  }

  const handleDeletePlace = (_id) => {
    deletePlace({
      variables: {
        _id
      }
    }).then(async (res) => {
      if (res.data && res.data.deletePlace) {
        await refetch()
        setState({ ...state, openDialog: false, place: null })
      }
    }).catch(err => {
      console.error(err)
    })
  }

  const handleGeoClick = (flag, name, place) => {
    if (flag && props.userProfile._id === props.idUser) {
      handleopenModal(name)
      return
    }

    if (!flag) {
      handleOpenDialog(place)
    }
  }

  if (loading) {
    return (
      <Paper className={classes.paperWrapper}>
        <CircularIndeterminate />
      </Paper>
    )
  }

  if (error || !data) {
    return (
      <div>Error</div>
    )
  }

  const { placesByUser } = data

  const map = (
    <Geographies geography={geoUrl}>
      {({ geographies }) => geographies.map(geo => {
        const index = placesByUser.findIndex(place => place.name === geo.properties.Name)
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill={index !== -1 ? '#ed6c11' : '#9998A3'}
            style={{
              default: { outline: 'none' },
              hover: { outline: 'none', cursor: 'pointer' },
              pressed: { outline: 'none' }
            }}
            onClick={() => handleGeoClick(index === -1, geo.properties.Name, placesByUser[index])}
          />
        ) 
      })}
    </Geographies>
  )

  return (
    <Paper className={classes.paperWrapper}>
      <ComposableMap
        projectionConfig={{
          rotation: [-20, 0, 0],
          scare: 150
        }}
        height={650}
        projection={geoCylindricalStereographic()}
      >
        <ZoomableGroup center={[108, 16]} zoom={17} disablePanning>
          {map}
        </ZoomableGroup>
      </ComposableMap>
      <FormModal defaultValue={state.placeDefault} open={state.openModal} onClose={handleCloseModal} refetch={refetch} />
      <PreviewPlace
        idUser={props.idUser}
        userProfile={props.userProfile}
        open={state.openDialog}
        onClose={handleCloseDialog}
        place={state.place}
        onDelete={handleDeletePlace}
      />
    </Paper>
  )
}

export default MapChart