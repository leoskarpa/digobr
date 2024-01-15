import type { AxiosResponse } from 'axios'
import { client } from './client'
import { Crossword } from './models/Crossword'
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

export type GenerateCrosswordVariables = {
  difficulty: {
    id: number
    description: string
  }
  topic: {
    id: number
    topicName: string
  }
}
export type GenerateCrosswordResponse = {
  puzzle: Word[]
}
export const generateCrossword = (variables: GenerateCrosswordVariables) => {
  return client.post<GenerateCrosswordResponse, AxiosResponse<GenerateCrosswordResponse>, GenerateCrosswordVariables>(
    '/generatePuzzle',
    variables,
  )
}

export type GetCrosswordParams = {
  crosswordId: number
}
export type GetCrosswordResponse = {
  puzzle: Word[]
}
export const getCrossword = (params: GetCrosswordParams) => {
  return client.get<GetCrosswordResponse, AxiosResponse<GetCrosswordResponse>, GetCrosswordParams>(
    '/generatePuzzle/by-id',
    { params },
  )
}

export type GetAllPreloadedPuzzlesResponse = Crossword[]
export const getAllPreloadedPuzzles = () => {
  return client.get<GetAllPreloadedPuzzlesResponse, AxiosResponse<GetAllPreloadedPuzzlesResponse>>('/preloaded-puzzles')
}
