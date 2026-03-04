import { request } from './client'

export const getMe = () => request('GET', '/api/auth/me')
