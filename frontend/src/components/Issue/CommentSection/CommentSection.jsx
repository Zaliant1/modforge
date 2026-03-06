import { useEffect, useState } from 'react'
import { Box, Typography, Avatar, TextField, Button } from '@mui/material'
import { getComments, createComment } from '~/api/comments'
import { useAuth } from '~/hooks/useAuth'
import { AVATAR_GRADIENTS } from '~/constants'
import { styles } from './CommentSection.styles'
import { getStyle } from '~/hooks/useStyles'

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
      setComments((prev) => [...prev, comment])
      setBody('')
    }
  }

  return (
    <Box sx={getStyle(styles, 'comment-section')}>
      <Typography sx={getStyle(styles, 'comment-section__header')}>
        Comments ({comments.length})
      </Typography>

      {comments.length > 0 ? (
        <Box sx={getStyle(styles, 'comment-section__list')}>
          {comments.map((comment, index) => {
            const { id: commentId, body: commentBody, author = {} } = comment || {}
            const { avatar_url: avatarUrl, username = '' } = author || {}
            return (
              <Box key={commentId} sx={getStyle(styles, 'comment-section__item')}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    ...getStyle(styles, 'comment-section__avatar'),
                    ...(!avatarUrl ? { background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] } : {}),
                  }}
                >
                  {(username || '?')[0]}
                </Avatar>
                <Box sx={getStyle(styles, 'comment-section__meta')}>
                  <Typography sx={getStyle(styles, 'comment-section__username')}>{username}</Typography>
                  <Box
                    dangerouslySetInnerHTML={{ __html: commentBody }}
                    sx={getStyle(styles, 'comment-section__body')}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box sx={getStyle(styles, 'comment-section__empty')}>No comments yet.</Box>
      )}

      {isAuthenticated && (
        <Box sx={getStyle(styles, 'comment-section__form')}>
          <Avatar
            src={userAvatar}
            sx={{
              ...getStyle(styles, 'comment-section__form-avatar'),
              ...(!userAvatar ? { background: AVATAR_GRADIENTS[0] } : {}),
            }}
          >
            {(userUsername || '?')[0]}
          </Avatar>
          <Box sx={getStyle(styles, 'comment-section__input-wrapper')}>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder='Add a comment...'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
              }}
              sx={getStyle(styles, 'comment-section__input')}
            />
            <Button
              variant='outlined'
              onClick={submit}
              sx={getStyle(styles, 'comment-section__submit')}
            >
              Comment
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
