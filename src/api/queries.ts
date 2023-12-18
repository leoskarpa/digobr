import { QueryClient, useMutation } from '@tanstack/react-query'
import { login } from './http'

export const queryClient = new QueryClient()

export const useLogin = () => {
  return useMutation({ mutationFn: login }, queryClient)
}
