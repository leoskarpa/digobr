import { atom, useRecoilState, useResetRecoilState } from 'recoil'
import { User } from '../api/models/User'

const userAtom = atom<User>({
  key: 'user',
  default: undefined,
})

export const useUser = () => {
  const [user, setUser] = useRecoilState(userAtom)
  const resetUser = useResetRecoilState(userAtom)

  return { user, setUser, resetUser }
}
