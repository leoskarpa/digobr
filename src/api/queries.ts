import { QueryClient, useMutation } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoginResponse, LoginVariables, RegisterResponse, RegisterVariables, login, register } from './http'

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
