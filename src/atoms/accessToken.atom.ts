import { atom, useRecoilState, useResetRecoilState } from 'recoil'
import { localStorageEffect } from './effects'

export const accessTokenAtom = atom<string>({
  key: 'accessToken',
  default: undefined,
  effects: [localStorageEffect('accessToken')],
})

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)
  const resetAccessToken = useResetRecoilState(accessTokenAtom)

  return { accessToken, setAccessToken, resetAccessToken }
}
