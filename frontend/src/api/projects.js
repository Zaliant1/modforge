import { request } from './client'

export const getProjects = () => request('GET', '/api/projects')
export const getProject = (id) => request('GET', `/api/projects/${id}`)
export const createProject = (data) =>
  request('POST', '/api/projects', {
    data,
    alert: true,
    alertMessage: 'Project created',
  })
export const updateProject = (id, data) =>
  request('PUT', `/api/projects/${id}`, {
    data,
    alert: true,
    alertMessage: 'Project updated',
  })
export const deleteProject = (id) =>
  request('DELETE', `/api/projects/${id}`, {
    alert: true,
    alertMessage: 'Project deleted',
  })

export const addProjectUser = (id, data) =>
  request('POST', `/api/projects/${id}/users`, { data, alert: true })
export const updateProjectUser = (id, userId, data) =>
  request('PUT', `/api/projects/${id}/users/${userId}`, { data, alert: true })
export const removeProjectUser = (id, userId) =>
  request('DELETE', `/api/projects/${id}/users/${userId}`, { alert: true })

export const getChangeRequests = (id) =>
  request('GET', `/api/projects/${id}/requests`)
export const submitChangeRequest = (id, data) =>
  request('POST', `/api/projects/${id}/requests`, { data, alert: true })
export const resolveChangeRequest = (id, reqId, data) =>
  request('PUT', `/api/projects/${id}/requests/${reqId}`, {
    data,
    alert: true,
  })
