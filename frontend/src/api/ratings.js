import { request } from './client'

export const createOrUpdateRating = (projectId, data) =>
  request('POST', `/api/projects/${projectId}/ratings`, {
    data,
    alert: true,
    alertMessage: 'Rating submitted',
  })
export const deleteRating = (projectId) =>
  request('DELETE', `/api/projects/${projectId}/ratings`, {
    alert: true,
    alertMessage: 'Rating removed',
  })
