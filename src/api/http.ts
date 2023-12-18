import type { AxiosResponse } from 'axios'
import { client } from './client'

export type LoginVariables = {
  usernameOrEmail: string
  password: string
}
export type LoginResponse = {
  accessToken: string
  id: number
  name: string
  email: string
}
export const login = (variables: LoginVariables) => {
  return client.post<LoginResponse, AxiosResponse<LoginResponse>, LoginVariables>('/auth/signin', variables)
}
