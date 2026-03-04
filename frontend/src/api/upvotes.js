import { request } from './client'

export const toggleUpvote = (issueId) =>
  request('POST', `/api/issues/${issueId}/upvote`)
