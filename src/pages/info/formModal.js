import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { useStyles } from './styles'

const initState = {
  isLoading: false,
  birthday: new Date(),
  description: '',
  email: '',
  name: '',
  address: '',
  gender: '',
  isChangeEmail: false
}

const FormModal = (props) => {
  const classes = useStyles()
  const [state, setState] = useState(initState)

  useEffect(() => {
    setState({
      ...state,
      birthday: props.defaultValue.birthday ? new Date(props.defaultValue.birthday) : new Date(),
      description: props.defaultValue.description ? props.defaultValue.description : '',
      email: props.defaultValue.email ? props.defaultValue.email : '',
      name: props.defaultValue.name ? props.defaultValue.name : '',
      address: props.defaultValue.address ? props.defaultValue.address : '',
      gender: props.defaultValue.gender ? props.defaultValue.gender : '',
      isChangeEmail: !props.defaultValue.email
    })
  }, [props.defaultValue])

  const { open, onClose, onSubmit } = props
  const { name, birthday, address, email, isLoading, description, isOpenAlert, isSuccess, gender, isChangeEmail } = state

  const onChangeDate = (date) => {
    setState({ ...state, birthday: date })
  }

  const handleChangeText = (e, type) => {
    if (type === 'name') {
      setState({ ...state, name: e.target.value })
      return
    }

    if (type === 'email') {
      setState({ ...state, email: e.target.value })
      return
    }

    if (type === 'address') {
      setState({ ...state, address: e.target.value })
      return
    }

    if (type === 'description') {
      setState({ ...state, description: e.target.value })
    }
  }

  const handleChangeItemGender = (e) => {
    setState({ ...state, gender: e.target.value })
  }

  const handleUpdateUser = () => {
    setState({ ...state, isLoading: true })
    onSubmit({
      name,
      birthday: +birthday,
      address,
      email,
      description,
      gender
    })
    setState({ ...state, isLoading: false })
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Cập nhật thông tin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            className={classes.textInput}
            fullWidth
            margin='normal'
            label='Họ tên'
            placeholder='Họ tên...'
            variant='outlined'
            value={name}
            onChange={(e) => handleChangeText(e, 'name')}
          />
          <FormControl variant='outlined' className={classes.formControl}>
            <InputLabel id='gender-label'>Giới tính</InputLabel>
            <Select
              labelId='gender-label'
              value={gender}
              onChange={handleChangeItemGender}
              label='Giới tính'
            >
              <MenuItem value={'male'}>Nam</MenuItem>
              <MenuItem value={'female'}>Nữ</MenuItem>
            </Select>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.dateInput}
              disableToolbar
              format='dd/MM/yyyy'
              inputVariant='outlined'
              margin='normal'
              id='birthday'
              label='Ngày sinh'
              value={birthday}
              onChange={(date) => onChangeDate(date)}
            />
          </MuiPickersUtilsProvider>
          <TextField
            className={classes.textInput}
            fullWidth
            margin='normal'
            label='Email'
            placeholder='Email...'
            variant='outlined'
            value={email}
            disabled={!isChangeEmail}
            onChange={(e) => handleChangeText(e, 'email')}
          />
          <TextField
            className={classes.textInput}
            fullWidth
            margin='normal'
            label='Địa chỉ'
            placeholder='Địa chỉ...'
            variant='outlined'
            value={address}
            onChange={(e) => handleChangeText(e, 'address')}
          />
          <TextField
            className={classes.textInput}
            fullWidth
            margin='normal'
            label='Giới thiệu'
            placeholder='Giới thiệu...'
            variant='outlined'
            value={description}
            onChange={(e) => handleChangeText(e, 'description')}
          />
        </DialogContent>
        <DialogActions>
          <div className={classes.buttonWrapper}>
            <Button color='primary' disabled={isLoading} onClick={handleUpdateUser}>
              Cập nhật
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Button onClick={onClose} color='primary' disabled={isLoading}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FormModal