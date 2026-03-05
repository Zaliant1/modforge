import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
import { useIssue } from '~/hooks/useIssue'
import { DetailsTab } from './DetailsTab/DetailsTab'
import { ModlogTab } from './ModlogTab/ModlogTab'
import { AssignmentsTab } from './AssignmentsTab/AssignmentsTab'
import { CommentSection } from '~/components/Issue/CommentSection/CommentSection'
import { styles } from './IssuePage.styles'
import { useStyles } from '~/hooks/useStyles'

export const IssuePage = () => {
  const { issue, setIssue, loading } = useIssue() || {}
  const [tab, setTab] = useState(0)
  const { summary, id: issueId } = issue || {}

  if (loading || !issue) return null

  return (
    <Box>
      <Typography variant='h5' sx={useStyles(styles, 'issue-page__title')}>
        {summary}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, tabValue) => setTab(tabValue)}
        sx={useStyles(styles, 'issue-page__tabs')}
      >
        <Tab label='Details' />
        <Tab label='Attachments' />
        <Tab label='Mod Logs' />
        <Tab label='Assignments' />
      </Tabs>

      {tab === 0 && <DetailsTab issue={issue} setIssue={setIssue} />}
      {tab === 1 && (
        <Box sx={useStyles(styles, 'issue-page__no-attachment')}>No attachments.</Box>
      )}
      {tab === 2 && <ModlogTab issue={issue} />}
      {tab === 3 && <AssignmentsTab issue={issue} setIssue={setIssue} />}

      <CommentSection issueId={issueId} />
    </Box>
  )
}

