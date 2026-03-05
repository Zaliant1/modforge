import { request } from './client'

export const getProjectStats = (projectId) =>
  request('GET', `/api/projects/${projectId}/stats`)
