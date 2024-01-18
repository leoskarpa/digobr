import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import {
  GenerateCrosswordResponse,
  GenerateCrosswordVariables,
  GetAllPreloadedPuzzlesResponse,
  GetCrosswordParams,
  GetCrosswordResponse,
  GetDifficultiesResponse,
  GetHintResponse,
  GetHintVariables,
  GetStatsResponse,
  GetTopicsResponse,
  LoginResponse,
  LoginVariables,
  RegisterResponse,
  RegisterVariables,
  SubmitPuzzleResponse,
  SubmitPuzzleVariables,
  generateCrossword,
  getAllPreloadedPuzzles,
  getCrossword,
  getDifficulties,
  getHint,
  getMe,
  getStats,
  getTopics,
  likePuzzle,
  login,
  register,
  submitPuzzle,
} from './http'
import { User } from './models/User'

export const queryClient = new QueryClient()

export const useLogin = () => {
  return useMutation<AxiosResponse<LoginResponse>, AxiosError<LoginResponse>, LoginVariables>(
    { mutationFn: login },
    queryClient,
  )
}

export const useRegister = () => {
  return useMutation<AxiosResponse<RegisterResponse>, AxiosError<RegisterResponse>, RegisterVariables>(
    { mutationFn: register },
    queryClient,
  )
}

export const useGenerateCrossword = () => {
  return useMutation<
    AxiosResponse<GenerateCrosswordResponse>,
    AxiosError<GenerateCrosswordResponse>,
    GenerateCrosswordVariables
  >({ mutationFn: generateCrossword }, queryClient)
}

export const useGetCrossword = (params: GetCrosswordParams) => {
  return useQuery<AxiosResponse<GetCrosswordResponse>, AxiosError<GetCrosswordResponse>>(
    { queryKey: ['crossword', params], queryFn: () => getCrossword(params), refetchOnWindowFocus: false },
    queryClient,
  )
}

export const useGetAllPreloadedPuzzles = () => {
  return useQuery<AxiosResponse<GetAllPreloadedPuzzlesResponse>, AxiosError<GetAllPreloadedPuzzlesResponse>>(
    {
      queryKey: ['preloaded'],
      queryFn: getAllPreloadedPuzzles,
    },
    queryClient,
  )
}

export const useGetDifficulties = () => {
  return useQuery<AxiosResponse<GetDifficultiesResponse>, AxiosError<GetDifficultiesResponse>>(
    { queryKey: ['difficulties'], queryFn: getDifficulties, refetchOnWindowFocus: false },
    queryClient,
  )
}

export const useGetTopics = () => {
  return useQuery<AxiosResponse<GetTopicsResponse>, AxiosError<GetTopicsResponse>>(
    { queryKey: ['topics'], queryFn: getTopics, refetchOnWindowFocus: false },
    queryClient,
  )
}

export const useLikePuzzle = () => {
  return useMutation(
    {
      mutationFn: likePuzzle,
      onMutate: async variables => {
        await queryClient.cancelQueries({ queryKey: ['crossword', variables] })

        const previousCrossword = queryClient.getQueryData<AxiosResponse<GetCrosswordResponse>>([
          'crossword',
          variables,
        ])

        queryClient.setQueryData<AxiosResponse<GetCrosswordResponse>>(
          ['crossword', variables],
          old =>
            old && {
              ...old,
              data: {
                ...old.data,
                puzzleInfo: {
                  ...old.data.puzzleInfo,
                  isLiked: true,
                },
              },
            },
        )

        return { previousCrossword }
      },
      onError: (_, variables, context) => {
        queryClient.setQueryData(['crossword', variables], context?.previousCrossword)
      },
    },
    queryClient,
  )
}

export const useSubmitPuzzle = () => {
  return useMutation<AxiosResponse<SubmitPuzzleResponse>, AxiosError<SubmitPuzzleResponse>, SubmitPuzzleVariables>(
    { mutationFn: submitPuzzle },
    queryClient,
  )
}

export const useGetMe = () => {
  return useQuery<AxiosResponse<User>, AxiosError<User>>(
    { queryKey: ['me'], queryFn: getMe, refetchOnWindowFocus: false, retry: false },
    queryClient,
  )
}

export const useGetHint = () => {
  return useMutation<AxiosResponse<GetHintResponse>, AxiosError<GetHintResponse>, GetHintVariables>(
    { mutationFn: getHint },
    queryClient,
  )
}

export const useGetStats = () => {
  return useQuery<AxiosResponse<GetStatsResponse>, AxiosError<GetStatsResponse>>(
    { queryKey: ['stats'], queryFn: getStats },
    queryClient,
  )
}
