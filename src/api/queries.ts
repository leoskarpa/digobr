import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import {
  GenerateCrosswordResponse,
  GenerateCrosswordVariables,
  GetAllPreloadedPuzzlesResponse,
  GetCrosswordParams,
  GetCrosswordResponse,
  LoginResponse,
  LoginVariables,
  RegisterResponse,
  RegisterVariables,
  generateCrossword,
  getAllPreloadedPuzzles,
  getCrossword,
  login,
  register,
} from './http'

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
    { queryKey: ['query', params], queryFn: () => getCrossword(params), refetchOnWindowFocus: false },
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
