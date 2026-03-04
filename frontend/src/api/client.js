import axios from 'axios'
import { parseJwt } from '~/utils/jwt'
import { dispatchAlert } from '~/store'

export const request = async (method, url, options = {}) => {
  const jwt = localStorage.getItem('jwt')

  if (!jwt) {
    throw new Error('Unauthorized')
  }

  if (Date.now() >= parseJwt(jwt).exp * 1000) {
    dispatchAlert({ message: 'Session expired...', type: 'error' })
    localStorage.removeItem('jwt')
    setTimeout(() => {
      window.location = '/'
    }, 5000)
    return
  }

  return axios({
    method,
    url,
    data: options.data,
    params: options.params,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': options.multipart
        ? 'multipart/form-data'
        : 'application/json',
      ...options.headers,
    },
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 400 && options.alert) {
        dispatchAlert({
          message: options.alertMessage || 'Success',
          type: 'success',
        })
      }
      return res.data
    })
    .catch((error) => {
      if (error?.response?.status === 403) {
        dispatchAlert({ message: 'Forbidden', type: 'error' })
      } else {
        dispatchAlert({
          message: error?.response?.data?.detail || 'An error occurred',
          type: 'error',
        })
        throw error
      }
    })
}
