import { request } from './client'

export const getIssues = (projectId, params) =>
  request('GET', `/api/projects/${projectId}/issues`, { params })
export const getIssue = (projectId, issueId) =>
  request('GET', `/api/projects/${projectId}/issues/${issueId}`)
export const createIssue = (projectId, data) =>
  request('POST', `/api/projects/${projectId}/issues`, {
    data,
    alert: true,
    alertMessage: 'Issue created',
  })
export const updateIssue = (projectId, issueId, data) =>
  request('PUT', `/api/projects/${projectId}/issues/${issueId}`, {
    data,
    alert: true,
  })
export const deleteIssue = (projectId, issueId) =>
  request('DELETE', `/api/projects/${projectId}/issues/${issueId}`, {
    alert: true,
    alertMessage: 'Issue deleted',
  })
