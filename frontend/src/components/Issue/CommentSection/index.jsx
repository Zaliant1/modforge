import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
} from '@mui/material'
import { getComments, createComment } from '~/api/comments'
import { useAuth } from '~/hooks/useAuth'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const CommentSection = ({ issueId }) => {
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const { user, isAuthenticated } = useAuth() || {}
  const { avatar_url: userAvatar, username: userUsername = '' } = user || {}

  useEffect(() => {
    getComments(issueId)
      .then(setComments)
      .catch(() => {})
  }, [issueId])

  const submit = async () => {
    if (!body.trim()) return
    const comment = await createComment(issueId, { body })
    if (comment) {
      setComments((prevComments) => [...prevComments, comment])
      setBody('')
    }
  }

  return (
    <Box sx={useStyles(styles, 'comment-section')}>
      <Divider sx={useStyles(styles, 'comment-section__divider')} />
      <Typography variant='h6' gutterBottom>
        Comments
      </Typography>

      {comments.map((comment) => {
        const { id: commentId, body: commentBody, author = {} } = comment || {}
        const { avatar_url, username = '' } = author || {}
        return (
          <Box key={commentId} sx={useStyles(styles, 'comment-section__item')}>
            <Avatar
              src={avatar_url}
              sx={useStyles(styles, 'comment-section__avatar')}
            >
              {username[0]}
            </Avatar>
            <Box>
              <Typography variant='body2' fontWeight={700}>
                {username}
              </Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: commentBody }}
                sx={useStyles(styles, 'comment-section__body')}
              />
            </Box>
          </Box>
        )
      })}

      {isAuthenticated && (
        <Box sx={useStyles(styles, 'comment-section__form')}>
          <Avatar
            src={userAvatar}
            sx={useStyles(styles, 'comment-section__form-avatar')}
          >
            {userUsername[0]}
          </Avatar>
          <Box sx={useStyles(styles, 'comment-section__input-wrapper')}>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder='Add a comment...'
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            <Button
              variant='contained'
              sx={useStyles(styles, 'comment-section__submit')}
              onClick={submit}
            >
              Comment
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

