import { css } from '@emotion/react'
import { Player } from '@lottiefiles/react-lottie-player'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useGetMe } from '../../api/queries'
import { useUser } from '../../atoms'
import { Footer } from '../Footer'
import { Header } from '../Header'

import LoadingAnimation from '../../assets/animations/processing.json'

const container = css`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`

const mainContainer = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Main = () => {
  const { setUser } = useUser()
  const { data: userData, isLoading } = useGetMe()

  useEffect(() => userData?.data && setUser(userData?.data), [userData, setUser])

  return (
    <div css={container}>
      <Header />
      <main css={mainContainer}>{isLoading ? <Player src={LoadingAnimation} autoplay loop /> : <Outlet />}</main>
      <Footer />
    </div>
  )
}
