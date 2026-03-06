import { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Fade } from '@mui/material'
import { useIssue } from '~/hooks/useIssue'
import { DetailsTab } from './DetailsTab/DetailsTab'
import { ModlogTab } from './ModlogTab/ModlogTab'
import { AssignmentsTab } from './AssignmentsTab/AssignmentsTab'
import { CommentSection } from '~/components/Issue/CommentSection/CommentSection'
import { styles } from './IssuePage.styles'
import { getStyle } from '~/hooks/useStyles'

export const IssuePage = () => {
  const { issue, setIssue, loading } = useIssue() || {}
  const [tab, setTab] = useState(0)
  const { summary, id: issueId } = issue || {}

  const [commentFade, setCommentFade] = useState(false)

  useEffect(() => {
    setCommentFade(false)
    const t = setTimeout(() => setCommentFade(true), 50)
    return () => clearTimeout(t)
  }, [tab])

  if (loading || !issue) return null

  return (
    <Box sx={getStyle(styles, 'issue-page')}>
      <Box sx={getStyle(styles, 'issue-page__header')}>
        <Typography sx={getStyle(styles, 'issue-page__id')}>#{issueId}</Typography>
        <Typography sx={getStyle(styles, 'issue-page__title')}>{summary}</Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={getStyle(styles, 'issue-page__tabs')}
      >
        <Tab label='Details' sx={getStyle(styles, 'issue-page__tab')} />
        <Tab label='Mod Logs' sx={getStyle(styles, 'issue-page__tab')} />
        <Tab label='Assignments' sx={getStyle(styles, 'issue-page__tab')} />
      </Tabs>

      <Box sx={getStyle(styles, 'issue-page__content')}>
        {tab === 0 && <DetailsTab issue={issue} setIssue={setIssue} />}
        {tab === 1 && <ModlogTab issue={issue} />}
        {tab === 2 && <AssignmentsTab issue={issue} setIssue={setIssue} />}
      </Box>

      <Fade in={commentFade} timeout={700} key={`comments-${tab}`}>
        <Box>
          <CommentSection issueId={issueId} />
        </Box>
      </Fade>
    </Box>
  )
}

