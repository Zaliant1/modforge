import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getIssue } from '~/api/issues'

export const useIssue = () => {
  const { id: projectId, issueId } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId && issueId) {
      setLoading(true)
      getIssue(projectId, issueId)
        .then(setIssue)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [projectId, issueId])

  return { issue, setIssue, loading }
}
