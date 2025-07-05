import api from './index'

export interface AuthCredentials {
  email: string
  password: string
}

export const register = async (credentials: AuthCredentials): Promise<string> => {
  const res = await api.post<{ token: string }>('/auth/register', credentials)
  return res.data.token
}

export const login = async (credentials: AuthCredentials): Promise<string> => {
  const res = await api.post<{ token: string }>('/auth/login', credentials)
  return res.data.token
}