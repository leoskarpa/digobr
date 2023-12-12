import { css } from '@emotion/react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../Footer'
import { Header } from '../Header'

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
  return (
    <div css={container}>
      <Header />
      <main css={mainContainer}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
