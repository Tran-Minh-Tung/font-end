import React, { useEffect, useState, useRef, forwardRef } from 'react'
import {
  GridList,
  GridListTileBar,
  GridListTile,
  Paper,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Backdrop,
  Slide,
  Typography
} from '@material-ui/core'
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Close as CloseIcon
} from '@material-ui/icons'
import { useMutation } from 'react-apollo'
import { DropzoneDialog } from 'material-ui-dropzone'
import { uploadImage } from '../../../util'
import { CircularIndeterminate, Alert, LinearProgressWithLabel } from '../../../components'
import { Client } from '../../../tools'
import { GET_ALBUMS, CREATE_ALBUM, DELETE_ALBUM, ADD_IMAGE, REMOVE_IMAGE, ADD_MULTI_IMAGE } from './queries'
import { useStyles } from './styles'

const Transition = forwardRef((props, ref) => (
  <Slide direction='up' ref={ref} {...props} />
))

function Gallery (props) {
  const classes = useStyles()
  const refModalInput = useRef()

  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showImages, setShowImage] = useState(false)
  const [albumSelected, setAlbumSelected] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [noitifyMessage, setNoitifyMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [openProgress, setOpenProgress] = useState(false)
  const [openDropZone, setOpenDropZone] = useState(false)
  const [isErrorInput, setIsErrorInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // button loading

  const [createAlbum] = useMutation(CREATE_ALBUM)
  const [deleteAlbum] = useMutation(DELETE_ALBUM)
  const [addMultiImage] = useMutation(ADD_MULTI_IMAGE)
  const [removeImage] = useMutation(REMOVE_IMAGE)

  const { idUser, userProfile } = props

  useEffect(() => {
    setLoading(true)
    Client.query({
      query: GET_ALBUMS,
      variables: {
        _id: idUser
      }
    }).then(res => {
      const { data } = res
      if (data && data.albumsByUser) {
        setAlbums(data.albumsByUser)
        setLoading(false)
        setError(false)
      }
    }).catch(err => {
      console.err(err)
      setLoading(false)
      setError(true)
    })
  }, [])

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleCreateAlbum = () => {
    if (refModalInput.current.value === '') {
      setIsErrorInput(true)
      return
    }

    createAlbum({
      variables: {
        name: refModalInput.current.value
      }
    }).then((res) => {
      const { data } = res
      if (data && data.createAlbum) {
        setNoitifyMessage('Tạo album thành công')
        setIsSuccess(true)
        setOpenAlert(true)
        setOpenModal(false)
        setAlbums([...albums, data.createAlbum])
      } else {
        setNoitifyMessage('Tạo album thất bại. Xảy ra lỗi!!!')
        setIsSuccess(false)
        setOpenAlert(true)
        setOpenModal(false)
      }
    }).catch(err => {
      setNoitifyMessage('Tạo album thất bại. Xảy ra lỗi!!!')
      setIsSuccess(false)
      setOpenAlert(true)
      setOpenModal(false)
    })
  }

  const onChangeInput = () => {
    if (refModalInput.current.value === '') {
      setIsErrorInput(true)
    } else {
      setIsErrorInput(false)
    }
  }

  const handleDeleteAlbum = (e, _id) => {
    e.stopPropagation()
    deleteAlbum({
      variables: {
        _id
      }
    }).then(res => {
      const { data } = res
      if (data && data.deleteAlbum) {
        const newAlbums = [...albums]
        const index = newAlbums.findIndex(album => album._id === _id)
        newAlbums.splice(index, 1)
        setNoitifyMessage('Xóa album thành công')
        setIsSuccess(true)
        setAlbums(newAlbums)
        setShowImage(false)
        setOpenAlert(true)
      } else {
        setNoitifyMessage('Xóa album thất bại.Xảy ra lỗi!!!')
        setIsSuccess(false)
        setOpenAlert(true)
      }
    }).catch(err => {
      setNoitifyMessage('Xóa album thất bại.Xảy ra lỗi!!!')
      setIsSuccess(false)
      setOpenAlert(true)
    })
  }

  const onAlbumSelected = (album) => {
    setAlbumSelected(album)
    setShowImage(true)
  }

  const handleClosePreviewImages = () => {
    setShowImage(false)
  }

  const handleOpenDropZone = () => {
    setOpenDropZone(true)
  }

  const handleCloseDropZone = () => {
    setOpenDropZone(false)
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  const handleUploadImage = (files) => {
    const alpha = 99 / files.length
    const arrUrls = []
    setOpenDropZone(false)
    setProgress(0)
    setOpenProgress(true)
    files.map(async (file, i) => {
      const responseUploadImage = await uploadImage(file)
      arrUrls.push(responseUploadImage.url)
      setProgress(progress + alpha)

      if (i === files.length - 1) {
        addMultiImage({
          variables: {
            _id: albumSelected._id,
            imageUrls: arrUrls
          }
        }).then(res => {
          const { data } = res
          if (data && data.addMultiImage) {
            const newAlbums = [...albums]
            const index = newAlbums.findIndex(album => album._id === data.addMultiImage._id)
            newAlbums[index] = data.addMultiImage
            setAlbumSelected(data.addMultiImage)
            setAlbums(newAlbums)
            setProgress(100)
    
            setNoitifyMessage('Đã tải hình ảnh lên')
            setOpenProgress(false)
            setIsSuccess(true)
            setOpenAlert(true)
          } else {
            setNoitifyMessage('Xảy ra lỗi trong quá trình tải hình ảnh!!!')
            setIsSuccess(false)
            setOpenAlert(true)
            setOpenProgress(false)
          }
        }).catch(err => {
          console.log(err)
          setNoitifyMessage('Xảy ra lỗi trong quá trình tải hình ảnh!!!')
          setIsSuccess(false)
          setOpenAlert(true)
          setOpenProgress(false)
        })
      }
    })
  }

  const handleRemoveImage = (idImage) => {
    removeImage({
      variables: {
        _id: albumSelected._id,
        idImage
      }
    }).then(res => {
      const { data } = res
      if (data && data.removeImage) {
        const newAlbum = { ...albumSelected }
        const indexImage = newAlbum.images.findIndex(image => image._id === idImage)
        newAlbum.images.splice(indexImage, 1)
        setAlbumSelected(newAlbum)
        
        const newAlbums = [...albums]
        const indexAlbum = newAlbums.findIndex(album => album._id === newAlbum._id)
        newAlbums[indexAlbum] = newAlbum
        setAlbums(newAlbums)

        setNoitifyMessage('Đã xóa ảnh khỏi album')
        setIsSuccess(true)
        setOpenAlert(true)
      } else {
        setNoitifyMessage('Không thể xóa ảnh khỏi album. Xảy ra lỗi!!!')
        setIsSuccess(false)
        setOpenAlert(true)
      }
    }).catch(err => {
      setNoitifyMessage('Không thể xóa ảnh khỏi album. Xảy ra lỗi!!!')
      setIsSuccess(false)
      setOpenAlert(true)
    })
  }

  if (loading) {
    return (
      <Paper className={classes.paperWrapper}>
        <CircularIndeterminate />
      </Paper>
    )
  }
  
  if (error) {
    return (
      <div>Error</div>
    )
  }

  if (userProfile !== idUser && albums.length === 0) {
    return (
      <Paper className={classes.paperWrapper}>
        <Typography align='center'>
          Chưa có Album nào
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paperWrapper}>
      <GridList
        className={classes.gridListRoot}
        cellHeight={150}
        cols={4}
        spacing={10}
      >
        {userProfile._id === idUser && (
          <GridListTile className={classes.gridListTileRoot} onClick={handleOpenModal} classes={{ tile: classes.gridListTile }}>
            <AddCircleOutlineIcon className={classes.iconRoot} />
            <GridListTileBar
              title='Tạo album'
            />
          </GridListTile>
        )}
        {albums.map(album => (
          <GridListTile key={album._id} className={classes.gridListTileRoot} classes={{ tile: classes.gridListTile }} onClick={() => onAlbumSelected(album)}>
            <img src={album.images[0] ? album.images[0].url : ''} alt={album.images[0] ? album.images[0]._id : ''} />
            <GridListTileBar
              title={album.name}
            />
            <IconButton className={classes.buttonClose} onClick={(e) => handleDeleteAlbum(e, album._id)}>
              <CloseIcon />
            </IconButton>
          </GridListTile>
        ))}
      </GridList>
      <Dialog open={openModal} onClose={handleCloseModal} aria-labelledby='form-modal-title'>
        <DialogTitle id='form-modal-title'>Thêm album</DialogTitle>
        <DialogContent>
          <TextField
            error={isErrorInput}
            autoFocus
            fullWidth
            margin='normal'
            id='description-textarea'
            label='Tên album'
            placeholder='Tên album'
            variant='outlined'
            inputRef={refModalInput}
            helperText={isErrorInput ? 'Vui lòng nhập tên album' : null}
            onChange={onChangeInput}
          />
        </DialogContent>
        <DialogActions>
          <div className={classes.buttonWrapper}>
            <Button onClick={handleCreateAlbum} color='primary' disabled={isLoading}>
              Tạo
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Button onClick={handleCloseModal} color='primary' disabled={isLoading}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {albumSelected && (
        <Dialog classes={{ paper: classes.paperDialog }} fullScreen open={showImages} onClose={handleClosePreviewImages} TransitionComponent={Transition}>
          <AppBar
            position='fixed'
          >
            <Toolbar>
              <IconButton edge='start' color='inherit' onClick={handleClosePreviewImages} aria-label='close'>
                <CloseIcon />
              </IconButton>
              <div className={classes.nameAlbum}>
                <Typography variant='h6'>
                  Album&nbsp;
                  {albumSelected.name}
                </Typography>
                <Typography variant='body2'>
                  {albumSelected.images.length}
                  &nbsp;ảnh
                </Typography>
              </div>
              <div className={classes.buttonWrapper}>
                <Button color='inherit' onClick={(e => handleDeleteAlbum(e, albumSelected._id))} disabled={isLoading}>
                  Xóa album này
                </Button>
                {isLoading && <CircularProgress size={24} className={classes.buttonProgressClose} />}
              </div>
            </Toolbar>
          </AppBar>
          <div className={classes.drawerHeader} />
          <GridList
            className={classes.gridListRoot}
            cellHeight={150}
            cols={8}
            spacing={10}
          >
            {userProfile._id === idUser && (
              <GridListTile onClick={handleOpenDropZone} className={classes.gridListTileRoot} classes={{ tile: classes.gridListTile }}>
                <AddCircleOutlineIcon className={classes.iconRoot} />
                <GridListTileBar
                  title='Thêm ảnh'
                />
              </GridListTile>
            )}
            {albumSelected.images.map(image => (
              <GridListTile key={image._id} className={classes.gridListTileRoot}>
                <img src={image.url} alt={image._id} />
                <IconButton className={classes.buttonClose} onClick={() => handleRemoveImage(image._id)}>
                  <CloseIcon />
                </IconButton>
              </GridListTile>
            ))}
          </GridList>
        </Dialog>
      )}
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {isSuccess
          ? (
            <Alert onClose={handleCloseAlert} severity='success'>
              {noitifyMessage}
            </Alert>
          ) : (
            <Alert onClose={handleCloseAlert} severity='error'>
              {noitifyMessage}
            </Alert>
          )}
      </Snackbar>
      <DropzoneDialog
        dialogTitle='Chọn ảnh'
        dropzoneText='Kéo và thả hình ảnh hoặc click'
        open={openDropZone}
        filesLimit={100}
        onSave={(files) => {
          handleUploadImage(files)
        }}
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        showPreviews
        showFileNames={false}
        maxFileSize={10 * 1024 * 1024}
        onClose={handleCloseDropZone}
        showAlerts={['error']}
        getFileLimitExceedMessage={(filesLimit) => `Mỗi lần tải lên tối đa ${filesLimit} ảnh`}
        submitButtonText='Tải ảnh lên'
        cancelButtonText='Hủy'
        fullWidth
      />
      <Backdrop className={classes.backdrop} open={openProgress}>
        <div className={classes.progressWrapper}>
          <LinearProgressWithLabel value={progress} />
        </div>
      </Backdrop>
    </Paper>
  )
}

export default Gallery