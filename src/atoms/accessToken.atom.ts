import { atom, useRecoilState, useResetRecoilState } from 'recoil'

export const accessTokenAtom = atom<string>({
  key: 'accessToken',
  default: undefined,
})

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)
  const resetAccessToken = useResetRecoilState(accessTokenAtom)

  return { accessToken, setAccessToken, resetAccessToken }
}
