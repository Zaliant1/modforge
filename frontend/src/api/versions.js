import { request } from './client'

export const getVersions = (projectId) =>
  request('GET', `/api/projects/${projectId}/versions`)
export const createVersion = (projectId, data) =>
  request('POST', `/api/projects/${projectId}/versions`, {
    data,
    alert: true,
    alertMessage: 'Version created',
  })
export const updateVersion = (projectId, versionId, data) =>
  request('PUT', `/api/projects/${projectId}/versions/${versionId}`, {
    data,
    alert: true,
  })
export const deleteVersion = (projectId, versionId) =>
  request('DELETE', `/api/projects/${projectId}/versions/${versionId}`, {
    alert: true,
    alertMessage: 'Version deleted',
  })
