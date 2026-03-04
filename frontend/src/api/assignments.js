import { request } from './client'

export const createAssignment = (issueId, data) =>
  request('POST', `/api/issues/${issueId}/assignments`, { data, alert: true })
export const updateAssignment = (issueId, assignmentId, data) =>
  request('PUT', `/api/issues/${issueId}/assignments/${assignmentId}`, {
    data,
    alert: true,
  })
export const deleteAssignment = (issueId, assignmentId) =>
  request('DELETE', `/api/issues/${issueId}/assignments/${assignmentId}`, {
    alert: true,
  })
