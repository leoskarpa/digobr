import axios from 'axios'
import { getRecoil } from 'recoil-nexus'
import { accessTokenAtom } from '../atoms'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use(config => {
  const accessToken = getRecoil(accessTokenAtom)

  config.headers.Authorization = `Bearer ${accessToken}`

  return config
})
