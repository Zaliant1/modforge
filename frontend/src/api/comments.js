import { request } from './client'

export const getComments = (issueId) =>
  request('GET', `/api/issues/${issueId}/comments`)
export const createComment = (issueId, data) =>
  request('POST', `/api/issues/${issueId}/comments`, { data, alert: true })
export const updateComment = (issueId, commentId, data) =>
  request('PUT', `/api/issues/${issueId}/comments/${commentId}`, {
    data,
    alert: true,
  })
export const deleteComment = (issueId, commentId) =>
  request('DELETE', `/api/issues/${issueId}/comments/${commentId}`, {
    alert: true,
  })
