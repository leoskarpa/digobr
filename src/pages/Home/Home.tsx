import { css } from '@emotion/react'
import { Player } from '@lottiefiles/react-lottie-player'
import { orderBy } from 'lodash'
import { useMemo } from 'react'

import { Crossword } from '../../api/models/Crossword'
import { useGetAllPreloadedPuzzles } from '../../api/queries'
import GeneratingAnimation from '../../assets/animations/generating.json'
import { theme } from '../../utils/theme'
import { CrosswordCard } from './CrosswordCard'

const screenStyle = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`
const titleStyle = css`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.primary[800]};
  margin-top: 1rem;
`
const crosswordsContainerStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`
const animationStyle = css`
  width: 20rem;
`

export const HomePage = () => {
  const { data, isFetching } = useGetAllPreloadedPuzzles()

  const crosswords = useMemo<Crossword[]>(() => (data ? orderBy(data?.data, 'id', 'asc') : []), [data])

  return (
    <div css={screenStyle}>
      <div css={titleStyle}>All crosswords</div>
      <div
        css={[
          crosswordsContainerStyle,
          isFetching &&
            css`
              justify-content: center;
            `,
        ]}
      >
        {isFetching ? (
          <Player src={GeneratingAnimation} autoplay loop css={animationStyle} />
        ) : (
          crosswords.map(c => <CrosswordCard key={c.id} crossword={c} />)
        )}
      </div>
    </div>
  )
}
