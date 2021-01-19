import React, { useState, useRef, useEffect } from 'react'
import {
  Paper,
  TextField,
  Checkbox,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Snackbar,
  CircularProgress,
  Backdrop
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
  AddAPhoto as AddAPhotoIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon
} from '@material-ui/icons'
import ReactQuill, { Quill } from 'react-quill'
import ImageResize from '@taoqf/quill-image-resize-module'
import { debounce } from 'lodash'
import { DropzoneDialog } from 'material-ui-dropzone'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_POST } from './queries'
import 'react-quill/dist/quill.snow.css'

import Toolbar from './toolBar'
import { useStyles } from './styles'
import { uploadImage } from '../../util'
import { POST_TAG } from '../../constants'
import { Alert } from '../../components'
import './index.css'

const Size = Quill.import('formats/size')
Size.whitelist = ['extra-small', 'small', 'medium', 'large']
Quill.register(Size, true)

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font')
Font.whitelist = [
  'arial',
  'comic-sans',
  'courier-new',
  'georgia',
  'helvetica',
  'lucida'
]
Quill.register(Font, true)
Quill.register('modules/ImageResize', ImageResize, true)

const modules = {
  toolbar: {
    container: '#toolbar'
  },
  ImageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  }
}

const formats = [
  'header',
  'font',
  'size',
  'align',
  'background',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'color'
]

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

function Editor (props) {
  const classes = useStyles()

  const [state, setState] = useState({
    contentPost: '',
    textLength: 0,
    labelWidthSelect: 0,
    labelWidthImage: 0,
    isOpenDialog: false,
    infoPost: {
      title: '',
      summary: '',
      tags: [],
      file: null
    },
    errors: {
      title: '',
      summary: '',
      tags: '',
      file: '',
      contentPost: ''
    },
    isSucess: false,
    isOpenAlert: false,
    isLoading: false
  })

  const inputLabelSelected = useRef(null)

  const [createPost] = useMutation(CREATE_POST)

  const postTags = ['du lịch', 'kinh nghiệm', 'tam đảo', 'địa điểm', 'chia sẻ']

  const strip = html => {
    let returnedValue = document.createElement('div')
    returnedValue.innerHTML = html
    return returnedValue.textContent || returnedValue.innerText
  }
  const countWords = value => {
    let strippedValue = strip(value)
    if (!strippedValue) return 0
    const matchWords = String(strippedValue).match(/\S+/gi)
    if (matchWords) {
      return matchWords.length
    }
    return 0
  }

  const handleChangePost = debounce((field, value, text = null) => {
    // thiếu đếm số từ
    if (text) {
      setState({ ...state, contentPost: value, textLength: countWords(text) })
    } else {
      setState({ ...state, contentPost: value })
    }
  }, 400)

  const handleOpenDialog = () => {
    setState({ ...state, isOpenDialog: true })
  }

  const handleCloseDialog = () => {
    setState({ ...state, isOpenDialog: false })
  }

  const handleChangeInput = (e, eleName, value = null) => {
    const { infoPost, errors } = state
    const { target } = e
    // validate
    if (eleName === 'title') {
      errors.title = target.value === '' ? 'Vui lòng nhập tiêu đề' : ''
      infoPost[eleName] = target.value
    }

    if (eleName === 'tags') {
      errors.tags = value.length <= 0 ? 'Vui lòng thêm tag' : ''
      infoPost.tags = value.map(tag => tag.value)
    }

    if (eleName === 'summary') {
      infoPost[eleName] = target.value
    }

    // const info = { ...state.infoPost }
    // info[eleName] = target.value
    setState({ ...state, infoPost, errors })
  }

  const isError = (errors) => errors.title !== '' || errors.tags !== '' || errors.file !== '' || errors.contentPost !== ''

  const upload = async (postStatus = 'WAIT_APPROVE') => {
    setState({ ...state, isLoading: true })
    const errors = { ...state.errors }
    if (!state.infoPost.title) {
      console.log('1')
      errors.title = 'Vui lòng nhập tiêu đề'
    }

    if (state.infoPost.tags.length <= 0) {
      console.log('2')
      errors.tags = 'Vui lòng thêm tag'
    }

    if (!state.infoPost.file) {
      console.log('3')
      errors.file = 'Vui lòng chọn hình ảnh'
    }

    if (!state.contentPost) {
      console.log('4')
      errors.contentPost = 'Vui lòng nhập nội dung bài viết'
    }

    if (isError(errors)) {
      setState({ ...state, errors })
      console.log('error')
      return
    }

    const response = await uploadImage(state.infoPost.file)
    createPost({
      variables: {
        input: {
          title: state.infoPost.title,
          summary: state.infoPost.summary,
          content: state.contentPost,
          imageUrlPost: response.url,
          tags: state.infoPost.tags,
          status: postStatus
        }
      }
    }).then(res => {
      console.log(res)
      if (res.data.createPost) {
        setState({ ...state, isOpenAlert: true, isSucess: true, isLoading: false })
      } else {
        setState({ ...state, isOpenAlert: true, isSucess: false, isLoading: false })
      }
    }).catch(err => {
      console.log(err)
      setState({ ...state, isOpenAlert: true, isSucess: false, isLoading: false })
    })
    console.log(response)
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setState({ ...state, isOpenAlert: false })
  }

  return (
    <>
      <div className='post-container'>
        <div className='post-info'>
          <Paper className={classes.paperInputWrapper}>
            <form style={{ maxWidth: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
              <TextField
                id='title'
                name='title'
                classes={{ root: classes.inputRoot }}
                label='Tiêu đề'
                margin='normal'
                variant='outlined'
                value={state.infoPost.title}
                onChange={(e) => handleChangeInput(e, 'title')}
                error={!!state.errors.title}
                helperText={!!state.errors.title ? state.errors.title : null}
              />
              <TextField
                id='summary'
                name='summary'
                classes={{ root: classes.inputRoot }}
                label='Tóm tắt'
                margin='normal'
                variant='outlined'
                value={state.infoPost.summary}
                onChange={(e) => handleChangeInput(e, 'summary')}
              />
              <Autocomplete
                multiple
                id='checkboxes-tags-demo'
                className={classes.inputRoot}
                options={POST_TAG}
                disableCloseOnSelect
                getOptionLabel={(option) => option.title}
                onChange={(e, value) => handleChangeInput(e, 'tags', value)}
                renderOption={(option, { selected }) => (
                  <div>
                    <Checkbox
                      color='primary'
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </div>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant='outlined' label='Tags' />
                )}
              />
              {state.errors.tags ? <p className={classes.helperText} id='tags-helper-text'>{state.errors.tags}</p> : null}
              <Card className={classes.rootCard}>
                <CardActionArea onClick={handleOpenDialog}>
                  <CardMedia
                    className={classes.imageCard}
                    height={140}
                  >
                    {state.infoPost.file ? <img alt='imagePost' style={{ maxWidth: 400 }} src={URL.createObjectURL(state.infoPost.file)} /> : <AddAPhotoIcon style={{ fontSize: 100, marginLeft: 'auto', marginRight: 'auto' }} />}
                  </CardMedia>
                  <CardContent>
                    <Typography className={classes.textCard}>
                      Chọn ảnh bài viết
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              {state.errors.file ? <p className={classes.helperText} id='tags-helper-text'>{state.errors.file}</p> : null}
              <Button color='primary' fullWidth className={classes.buttonRoot} variant='contained' onClick={() => upload('WAIT_APPROVE')}>Đăng bài</Button>
              <DropzoneDialog
                dialogTitle='Chọn ảnh'
                dropzoneText='Kéo và thả hình ảnh hoặc click'
                open={state.isOpenDialog}
                filesLimit={1}
                onSave={(file) => {
                  setState({
                    ...state,
                    infoPost: { ...state.infoPost, file: file[0] },
                    isOpenDialog: { ...state.isOpenDialog, image: false },
                    errors: { ...state.errors, file: '' }
                  })
                }}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews
                maxFileSize={10 * 1024 * 1024}
                onClose={handleCloseDialog}
                getFileLimitExceedMessage={(filesLimit) => `Mỗi lần tải lên tối đa ${filesLimit} ảnh`}
                submitButtonText='Tải ảnh lên'
                cancelButtonText='Hủy'
                showAlerts={['error']}
              />
            </form>
          </Paper>
        </div>
        <Paper className='text-editor' classes={{ root: classes.paperEditor }}>
          <Toolbar />
          <ReactQuill
            onChange={(html, delta, source, editor) => {
              const text = editor.getText()
              handleChangePost('content', html, text)
            }}
            modules={modules}
            formats={formats}
            placeholder='Write text here...'

          />
        </Paper>
      </div>
      <Snackbar open={state.isOpenAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        {state.isSucess
          ? (
            <Alert onClose={handleCloseAlert} severity='success'>
              Thao tác thành công
            </Alert>
          ) : (
            <Alert onClose={handleCloseAlert} severity='error'>
              Lỗi!!!Thao tác không thành công
            </Alert>
          )}
      </Snackbar>
      <Backdrop className={classes.backdrop} open={state.isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default Editor