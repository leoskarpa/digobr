import axios, { AxiosError } from 'axios'
import { getRecoil, resetRecoil } from 'recoil-nexus'
import { accessTokenAtom, userAtom } from '../atoms'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use(config => {
  const accessToken = getRecoil(accessTokenAtom)

  config.headers.Authorization = `Bearer ${accessToken}`

  return config
})

client.interceptors.response.use(
  val => val,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      resetRecoil(userAtom)
      resetRecoil(accessTokenAtom)
    }

    throw error
  },
)
