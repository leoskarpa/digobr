import { css } from '@emotion/react'
import { Player } from '@lottiefiles/react-lottie-player'
import { toPairs, upperFirst } from 'lodash'
import { useGetStats } from '../../api/queries'
import { useUser } from '../../atoms'
import { theme } from '../../utils/theme'
import { StatCard } from './StatCard'

import LoadingAnimation from '../../assets/animations/processing.json'

const screenStyle = css`
  padding: 1rem;
`
const infoContainerStyle = css`
  margin-bottom: 2rem;
`
const titleStyle = css`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${theme.primary[700]};
`
const cardsContainerStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`

export const StatsPage = () => {
  const { user } = useUser()

  const { data: statsData, isLoading } = useGetStats()

  return (
    <div css={screenStyle}>
      <div css={infoContainerStyle}>
        <h2 css={titleStyle}>Your profile</h2>
        <p>
          Name: <b>{user.name}</b>
        </p>
        <p>
          Username: <b>{user.username}</b>
        </p>
        <p>
          Email: <b>{user.email}</b>
        </p>
      </div>
      <div>
        <h2 css={titleStyle}>Your stats</h2>
        <div css={cardsContainerStyle}>
          {isLoading ? (
            <Player src={LoadingAnimation} autoplay loop />
          ) : (
            toPairs(statsData?.data).map((val, idx) => (
              <StatCard key={idx} title={upperFirst(val[0].split(/(?=[A-Z])/).join(' '))} value={val[1]} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
