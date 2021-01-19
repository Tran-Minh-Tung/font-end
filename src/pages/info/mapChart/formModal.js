import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Snackbar
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Autocomplete } from '@material-ui/lab'
import { useMutation } from 'react-apollo'
import { Alert } from '../../../components'
import { CITY } from '../../../constants'
import { CREATE_PLACE } from './queries'
import { useStyles } from './styles'

const initState = {
  isLoading: false,
  place: null,
  startAt: new Date(),
  endAt: new Date(),
  description: '',
  isOpenAlert: false,
  isSuccess: false
}

const FormModal = (props) => {
  const classes = useStyles()
  const [state, setState] = useState(initState)
  const [createPlace] = useMutation(CREATE_PLACE)

  useEffect(() => {
    const place = CITY.find(city => city.value === props.defaultValue)
    setState({ ...initState, place })
  }, [props.defaultValue])

  const { open, onClose, refetch } = props
  const { place, startAt, endAt, isLoading, description, isOpenAlert, isSuccess } = state

  const onChangePlace = (e, value) => {
    setState({ ...state, place: value })
  }

  const onChangeDate = (date, type) => {
    if (type === 'start') {
      setState({ ...state, startAt: date, endAt: date })
      return
    }

    setState({ ...state, endAt: date })
  }

  const handleChangeText = (e) => {
    setState({ ...state, description: e.target.value })
  }

  const handleCreate = () => {
    setState({ ...state, isLoading: true })
    createPlace({
      variables: {
        input: {
          name: place.value,
          startAt: +startAt,
          endAt: +endAt,
          description
        }
      }
    }).then(async (res) => {
      const { data } = res
      if (data && data.createPlace) {
        await refetch()
        onClose()
        setState({ ...initState, isOpenAlert: true, isSuccess: true })
      } else {
        onClose()
        setState({ ...initState, isOpenAlert: true, isSuccess: false })
      }
    }).catch(err => {
      onClose()
      setState({ ...initState, isOpenAlert: true, isSuccess: false })
    })
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setState({ ...state, isOpenAlert: false })
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Thêm địa điểm</DialogTitle>
        <DialogContent>
          <Autocomplete
            id='combo-box-demo'
            options={CITY}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            renderInput={(params) => <TextField fullWidth {...params} label='Tỉnh' variant='outlined' />}
            onChange={onChangePlace}
            value={place}
          />
          <TextField
            autoFocus
            className={classes.descriptionInput}
            fullWidth
            margin='normal'
            id='description-textarea'
            label='Mô tả'
            placeholder='Mô tả...'
            multiline
            variant='outlined'
            value={description}
            onChange={handleChangeText}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.dateInput}
              disableToolbar
              format='dd/MM/yyyy'
              inputVariant='outlined'
              margin='normal'
              id='date-start'
              label='Ngày bắt đầu'
              value={startAt}
              onChange={(date) => onChangeDate(date, 'start')}
            />
            <KeyboardDatePicker
              className={classes.dateInput}
              minDate={startAt}
              disableToolbar
              format='dd/MM/yyyy'
              inputVariant='outlined'
              margin='normal'
              id='date-end'
              label='Ngày kết thúc'
              value={endAt}
              onChange={(date) => onChangeDate(date, 'end')}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <div className={classes.buttonWrapper}>
            <Button onClick={handleCreate} color='primary' disabled={isLoading}>
              Tạo
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Button onClick={onClose} color='primary' disabled={isLoading}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={isOpenAlert} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {isSuccess
          ? (
            <Alert onClose={handleCloseAlert} severity='success'>
              Tạo thành công
            </Alert>
          ) : (
            <Alert onClose={handleCloseAlert} severity='error'>
              Xảy ra lỗi!!!
            </Alert>
          )}
      </Snackbar>
    </>
  )
}

export default FormModal