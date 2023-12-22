import { QueryClient, useMutation } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import {
  GetCrosswordResponse,
  GetCrosswordVariables,
  LoginResponse,
  LoginVariables,
  RegisterResponse,
  RegisterVariables,
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

export const useGetCrossword = () => {
  return useMutation<AxiosResponse<GetCrosswordResponse>, AxiosError<GetCrosswordResponse>, GetCrosswordVariables>(
    { mutationFn: getCrossword },
    queryClient,
  )
}
