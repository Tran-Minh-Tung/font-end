import React, { useState, useEffect } from 'react'
import {
  Avatar,
  TextField,
  Typography,
  Box,
  Button
} from '@material-ui/core'
import { useMutation } from 'react-apollo'
import moment from 'moment'
import { CREATE_COMMENT, GET_COMMENTS, DELETE_COMMENT, UPDATE_COMMENT } from './queries'
import { useStyles } from './styles'
import { Client } from '../../tools'

const limitComment = 10

const Comment = (props) => {
  const classes = useStyles()

  const [allCommment, setAllComment] = useState(null)
  const [commentInput, setCommentInput] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [idEditComment, setIdEditComment] = useState(null)
  const [showMoreComment, setShowMoreComment] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const [createComment] = useMutation(CREATE_COMMENT)
  const [deleteComment] = useMutation(DELETE_COMMENT)
  const [updateComment] = useMutation(UPDATE_COMMENT)

  const { idPost, userProfile } = props

  const getData = (page = 0) => {
    Client.query({
      query: GET_COMMENTS,
      variables: {
        idPost,
        limit: limitComment,
        offset: page * limitComment
      }
    }).then(res => {
      const { data } = res
      if (data && data.comments) {
        if (!allCommment) {
          setAllComment(data.comments)
        } else {
          setAllComment([...allCommment, ...data.comments])
        }
        if (data.comments.length < limitComment) {
          setShowMoreComment(false)
        }
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const handleChangeInput = (e) => {
    setCommentInput(e.target.value)
  }

  const handleCreateComment = (e) => {
    if (e.keyCode === 13 && !commentLoading) {
      setCommentLoading(true)
      if (idEditComment) {
        updateComment({
          variables: {
            _id: idEditComment,
            input: {
              idPost,
              content: commentInput
            }
          }
        }).then(res => {
          const { data } = res
          if (data && data.updateComment) {
            setIdEditComment(null)
            setCommentInput('')
            const newComments = [...allCommment]
            const index = newComments.findIndex(comment => comment._id === data.updateComment._id)
            newComments[index] = data.updateComment
            setAllComment(newComments)
            setCommentLoading(false)
          } else {
            setIdEditComment(null)
            setCommentInput('')
            setCommentLoading(false)
          }
        })
      } else {
        createComment({
          variables: {
            input: {
              idPost,
              content: commentInput
            }
          }
        }).then(res => {
          const { data } = res
          if (data && data.createComment) {
            const comments = [...allCommment]
            comments.unshift(data.createComment)
            setAllComment(comments)
            setCommentInput('')
            setCommentLoading(false)
          } else {
            setCommentLoading(false)
          }
        })
      }
    }
  }

  const handleDeleteComment = (_id) => {
    deleteComment({
      variables: {
        _id
      }
    }).then(res => {
      const { data } = res
      if (data && data.deleteComment) {
        const newComments = [...allCommment]
        const index = newComments.findIndex(comment => comment._id === _id)
        newComments.splice(index, 1)
        setAllComment(newComments)
      }
    })
  }

  const handleUpdateComment = (comment) => {
    setIdEditComment(comment._id)
    setCommentInput(comment.content)
  }

  const handleShowMoreComment = () => {
    getData(currentPage + 1)
    setCurrentPage(currentPage + 1)
  }

  return (
    <div className={classes.commentWrapper}>
      <Typography color='primary' variant='h6' gutterBottom>
        Bình luận
      </Typography>
      <div className={classes.inputCommentWrapper}>
        {userProfile ? (
          <>
            <Avatar className={classes.avatarComment} src={userProfile.imageUrl} />
            <TextField
              variant='outlined'
              size='small'
              fullWidth
              placeholder='Nhập bình luận...'
              value={commentInput}
              onChange={handleChangeInput}
              onKeyDown={handleCreateComment}
              disabled={commentLoading}
            />
          </>
        ) : (
          <Typography>
            Bạn phải đăng nhập để có thể bình luận
          </Typography>
        )}
       
      </div>
      {allCommment && allCommment.map(comment => (
        <div className={classes.inputCommentWrapper}>
          <Avatar className={classes.avatarComment} src={comment.commentBy.imageUrl} />
          <div className={classes.contentCommentWrapper}>
            <Typography>
              <Box fontWeight='fontWeightBold' m={1}>
                {comment.commentBy.name}
              </Box>
            </Typography>
            <Typography>
              <Box fontWeight='fontWeightRegular' m={1}>
                {comment.content}
              </Box>
            </Typography>
            <Typography color='textSecondary'>
              <Box textAlign='right' fontSize={12} m={1}>
                {moment(comment.createdAt).format('DD-MM-YYYY hh:mm')}
              </Box>
            </Typography>
          </div>
          {userProfile && userProfile._id === comment.commentBy._id && (
            <div>
              <Typography color='textSecondary' className={classes.actionComment} onClick={() => handleUpdateComment(comment)}>
                <Box fontSize={12} m={1}>
                  Sửa
                </Box>
              </Typography>
              <Typography color='textSecondary' className={classes.actionComment} onClick={() => handleDeleteComment(comment._id)}>
                <Box fontSize={12} m={1}>
                  Xóa
                </Box>
              </Typography>
            </div>
          )}
        </div>
      ))}
      {showMoreComment && (
        <Button fullWidth variant='outlined' color='primary' onClick={handleShowMoreComment}>
          Xem thêm bình luận
        </Button>
      )}
    </div>
  )
}

export default Comment