import type { AxiosResponse } from 'axios'
import { client } from './client'
import { Crossword } from './models/Crossword'
import { Difficulty } from './models/Difficulty'
import { Topic } from './models/Topic'
import { User } from './models/User'
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
  difficultyId: number
  topicId: number
}
export type GenerateCrosswordResponse = number
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
  puzzleDto: { puzzle: Word[] }
  puzzleInfo: {
    difficultyId: number
    topicId: number
    isLiked: boolean
  }
}
export const getCrossword = (params: GetCrosswordParams) => {
  return client.get<GetCrosswordResponse, AxiosResponse<GetCrosswordResponse>, GetCrosswordParams>(
    '/generatePuzzle/by-id',
    { params },
  )
}

export type GetAllPreloadedPuzzlesResponse = Array<Crossword & { likedByUser: boolean }>
export const getAllPreloadedPuzzles = () => {
  return client.get<GetAllPreloadedPuzzlesResponse>('/preloaded-puzzles')
}

export type GetDifficultiesResponse = Difficulty[]
export const getDifficulties = () => {
  return client.get<GetDifficultiesResponse>('/difficulties')
}

export type GetTopicsResponse = Topic[]
export const getTopics = () => {
  return client.get<GetTopicsResponse>('/topics')
}

export type LikePuzzleVariables = {
  crosswordId: number
}
export const likePuzzle = (variables: LikePuzzleVariables) => {
  return client.post('/likePuzzle/by-id', {}, { params: variables })
}

export type AnswerType = {
  word: string
  desc: string
  usersAnswer: string
}
export type SubmitPuzzleVariables = {
  crosswordId: number
  correctAnswers: AnswerType[]
  incorrectAnswers: AnswerType[]
}
export type SubmitPuzzleResponse = {
  suggestedCrossword: {
    puzzleTopic: number
    puzzleDifficulty: number
  } | null
  analysis: string
}
export const submitPuzzle = (variables: SubmitPuzzleVariables) => {
  return client.post<SubmitPuzzleResponse, AxiosResponse<SubmitPuzzleResponse>, SubmitPuzzleVariables>(
    '/submitPuzzle',
    variables,
  )
}

export const getMe = () => {
  return client.get<User>('/getMe')
}

export type GetHintVariables = {
  word: string
  clue: string
}
export type GetHintResponse = {
  hint: string
}
export const getHint = (variables: GetHintVariables) => {
  return client.post<GetHintResponse, AxiosResponse<GetHintResponse>, GetHintVariables>('/hint', variables)
}
