import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { getChangeRequests, resolveChangeRequest } from '~/api/projects'
import { styles } from './ProjectChangeRequest.styles'
import { useStyles } from '~/hooks/useStyles'

export default function ProjectChangeRequest() {
  const { id } = useParams()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    getChangeRequests(id)
      .then(setRequests)
      .catch(() => {})
  }, [id])

  const resolve = async (reqId, approved) => {
    await resolveChangeRequest(id, reqId, { approved })
    setRequests((prevRequests) =>
      prevRequests.filter((request) => {
        const { id: requestId } = request || {}
        return requestId !== reqId
      }),
    )
  }

  return (
    <Box sx={useStyles(styles, 'change-request')}>
      <Typography variant='h5' gutterBottom>
        Pending Change Requests
      </Typography>
      <Divider sx={useStyles(styles, 'change-request__divider')} />

      {requests.length === 0 && (
        <Typography color='text.secondary'>No pending requests.</Typography>
      )}

      <List disablePadding>
        {requests.map((request) => {
          const { id: requestId, field, new_value: newValue } = request || {}
          return (
            <ListItem
              key={requestId}
              sx={useStyles(styles, 'change-request__item')}
              secondaryAction={
                <Box sx={useStyles(styles, 'change-request__actions')}>
                  <Button
                    size='small'
                    variant='contained'
                    color='success'
                    onClick={() => resolve(requestId, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    size='small'
                    variant='outlined'
                    color='error'
                    onClick={() => resolve(requestId, false)}
                  >
                    Reject
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={field}
                secondary={`New value: ${JSON.stringify(newValue)}`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
