import type { AxiosResponse } from 'axios'
import { client } from './client'
import { Word } from './models/Word'

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

export type RegisterVariables = {
  name: string
  username: string
  email: string
  password: string
}
export type RegisterResponse = {
  success: boolean
  message: string
}
export const register = (variables: RegisterVariables) => {
  return client.post<RegisterResponse, AxiosResponse<RegisterResponse>, RegisterVariables>('/auth/signup', variables)
}

export type GetCrosswordVariables = {
  difficulty: number
  topic: number
}
export type GetCrosswordResponse = {
  puzzle: Word[]
}
export const getCrossword = (variables: GetCrosswordVariables) => {
  return client.post<GetCrosswordResponse, AxiosResponse<GetCrosswordResponse>, GetCrosswordVariables>(
    '/test/generatePuzzle',
    variables,
  )
}
