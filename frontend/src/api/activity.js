import { request } from './client'

export const getProjectActivity = (projectId) =>
  request('GET', `/api/projects/${projectId}/activity`)
