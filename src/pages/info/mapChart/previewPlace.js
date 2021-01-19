import React, { forwardRef, useEffect, useState, useRef } from 'react'
import {
  Dialog,
  Typography,
  AppBar,
  IconButton,
  Button,
  Toolbar,
  Slide,
  CircularProgress,
  GridList,
  GridListTile,
  GridListTileBar,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Drawer,
  Backdrop,
  Divider
} from '@material-ui/core'
import {
  Close as CloseIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@material-ui/icons'
import { DropzoneDialog } from 'material-ui-dropzone'
import moment from 'moment'
import clsx from 'clsx'
import { useMutation } from 'react-apollo'

import { uploadImage } from '../../../util'
import { CITY } from '../../../constants'
import { Alert, LinearProgressWithLabel } from '../../../components'
import { ADD_ALBUM, REMOVE_ALBUM, ADD_IMAGE, REMOVE_IMAGE, ADD_MULTI_IMAGE } from './queries'
import { useStyles } from './styles'

const Transition = forwardRef((props, ref) => (
  <Slide direction='up' ref={ref} {...props} />
))

function PreviewPlace (props) {
  const classes = useStyles()
  const refModalInput = useRef()

  const [openProgress, setOpenProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [openDropZone, setOpenDropZone] = useState(false)
  const [albumSelected, setAlbumSelected] = useState(null)
  const [colAlbum, setColAlbum] = useState(8)
  const [isShowImages, setIsShowImages] = useState(false)
  const [isErrorInput, setIsErrorInput] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [place, setPlace] = useState(null)
  const [noitifyMessage, setNoitifyMessage] = useState('')

  const [addAlbum] = useMutation(ADD_ALBUM)
  const [removeAlbum] = useMutation(REMOVE_ALBUM)
  const [removeImage] = useMutation(REMOVE_IMAGE)
  const [addMultiImage] = useMutation(ADD_MULTI_IMAGE)

  useEffect(() => {
    if (props.place) {
      const initPlace = CITY.find(city => city.value === props.place.name)
      setPlace({ ...props.place, name: initPlace.title })
    }
  }, [props.place])

  const { open, onClose, onDelete, userProfile, idUser } = props

  if (!place) {
    return (<div />)
  }

  const handleDelete = () => {
    setIsLoading(true)
    onDelete(place._id)
    setIsLoading(false)
  }

  const handleCloseAlert = (e, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

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

    addAlbum({
      variables: {
        _id: place._id,
        albumName: refModalInput.current.value
      }
    }).then((res) => {
      const { data } = res
      if (data && data.addAlbum) {
        setNoitifyMessage('Tạo album thành công')
        setIsSuccess(true)
        setOpenAlert(true)
        setOpenModal(false)
        setPlace({ ...data.addAlbum, name: place.name })
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

  const handleRemoveAlbum = (e, _id) => {
    e.stopPropagation()
    removeAlbum({
      variables: {
        _id: place._id,
        idAlbum: _id
      }
    }).then(res => {
      const { data } = res
      if (data && data.removeAlbum) {
        const newPlace = { ...place }
        const index = newPlace.albums.findIndex(album => album._id === _id)
        newPlace.albums.splice(index, 1)
        setNoitifyMessage('Xóa album thành công')
        setIsSuccess(true)
        setOpenAlert(true)
        setIsShowImages(false)
        setColAlbum(8)
        setPlace(newPlace)
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
    setIsShowImages(true)
    setAlbumSelected(album)
    setColAlbum(4)
  }

  const handleOpenDropZone = () => {
    setOpenDropZone(true)
  }

  const handleCloseDropZone = () => {
    setOpenDropZone(false)
  }

  const handleUploadImage = (files) => {
    const arrUrls = []
    setOpenDropZone(false)
    setProgress(0)
    setOpenProgress(true)
    files.map(async (file, i) => {
      const responseUploadImage = await uploadImage(file)
      arrUrls.push(responseUploadImage.url)
      setProgress(50)

      if (i === files.length - 1) {
        addMultiImage({
          variables: {
            _id: albumSelected._id,
            imageUrls: arrUrls
          }
        }).then(res => {
          const { data } = res
          if (data && data.addMultiImage) {
            const newPlace = { ...place } 
            const index = newPlace.albums.findIndex(album => album._id === data.addMultiImage._id)
            newPlace.albums[index] = data.addMultiImage
            setAlbumSelected(data.addMultiImage)
            setPlace(newPlace)
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

  const handleCloseImagesPreview = () => {
    setIsShowImages(false)
    setColAlbum(8)
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
        
        const newPlace = { ...place }
        const indexAlbum = newPlace.albums.findIndex(album => album._id === newAlbum._id)
        newPlace.albums[indexAlbum] = newAlbum
        setPlace(newPlace)

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

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
        <AppBar
          position='fixed'
          className={clsx(classes.appBar, {
            [classes.appBarShift]: isShowImages
          })}
        >
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={onClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <div className={classes.info}>
              <Typography variant='h6'>
                {place.name}
              </Typography>
              <Typography variant='subtitle1'>
                Ngày bắt đầu:&nbsp;
                {moment(place.startAt).format('DD-MM-YYYY')}
                &nbsp;- Ngày kết thúc:&nbsp;
                {moment(place.endAt).format('DD-MM-YYYY')}
              </Typography>
              <Typography variant='body2'>
                {place.description}
              </Typography>
            </div>
            <div className={classes.buttonWrapper}>
              <Button onClick={handleDelete} color='inherit' disabled={isLoading}>
                Xóa địa điểm này
              </Button>
              {isLoading && <CircularProgress size={24} className={classes.buttonProgressClose} />}
            </div>
            {isShowImages && (
              <IconButton edge='start' color='inherit' onClick={handleCloseImagesPreview} aria-label='close'>
                <KeyboardArrowRightIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: isShowImages
          })}
        >
          <div className={classes.drawerHeader} />
          <GridList
            className={clsx(classes.gridListRoot, {
              [classes.gridListShift]: isShowImages
            })}
            cellHeight={150}
            cols={colAlbum}
            spacing={10}
          >
            {idUser === userProfile._id && (
              <GridListTile className={classes.gridListTileRoot} onClick={handleOpenModal} classes={{ tile: classes.gridListTile }}>
                <AddCircleOutlineIcon className={classes.iconRoot} />
                <GridListTileBar
                  title='Tạo album'
                />
              </GridListTile>
            )}
            {place.albums.map(album => (
              <GridListTile key={album._id} className={classes.gridListTileRoot} classes={{ tile: classes.gridListTile }} onClick={() => onAlbumSelected(album)}>
                <img src={album.images[0] ? album.images[0].url : ''} alt={album.images[0] ? album.images[0]._id : ''} />
                <GridListTileBar
                  title={album.name}
                />
                <IconButton className={classes.buttonClose} onClick={(e) => handleRemoveAlbum(e, album._id)}>
                  <CloseIcon />
                </IconButton>
              </GridListTile>
            ))}
          </GridList>
        </main>
        
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='right'
          open={isShowImages}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {isShowImages && (
            <>
              <div className={classes.imageTitleWrapper}>
                <Typography variant='h6'>
                  Album&nbsp;
                  {albumSelected.name}
                </Typography>
                <Typography variant='body2'>
                  {albumSelected.images.length}
                  &nbsp;ảnh
                </Typography>
              </div>
              <Divider orientation='horizontal' />
              <GridList
                className={classes.gridListRoot}
                cellHeight={150}
                cols={4}
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
            </>
          )}
        </Drawer>
      </Dialog>
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
    </>
  )
}

export default PreviewPlace