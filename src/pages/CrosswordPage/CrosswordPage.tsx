import { css } from '@emotion/react'
import { CrosswordGrid, CrosswordProvider, DirectionClues } from '@jaredreisinger/react-crossword'
import { ClueTypeOriginal, CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'
import { Player } from '@lottiefiles/react-lottie-player'
import { useMemo } from 'react'

import { useGetCrossword } from '../../api/queries'
import GeneratingAnimation from '../../assets/animations/generating.json'
import { theme } from '../../utils/theme'
import { useRequiredParams } from '../../utils/types'

const screenStyle = css`
  padding: 1rem;
`
const crosswordContainerStyle = css`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  > * :focus {
    outline: none;
  }
`
const gridStyle = css`
  align-self: center;
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 64rem;
  max-height: 64rem;
  background-color: ${theme.primary[200]};
  padding: 2rem;
  border-radius: 0.5rem;
  justify-content: center;

  > .crossword.grid {
    > div {
      display: flex;
      justify-content: center;
      max-height: 100%;
    }
  }
`
const cluesContainerStyle = css`
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`
const animationStyle = css`
  width: 20rem;
`

type CrosswordPageParams = {
  id: string
}
export const CrosswordPage = () => {
  const { id } = useRequiredParams<CrosswordPageParams>()
  const { data, isFetching } = useGetCrossword({ crosswordId: +id })

  const crossword = useMemo<CluesInputOriginal | null>(
    () =>
      data
        ? data.data.puzzle.reduce<CluesInputOriginal>(
            (final, curr, idx) => {
              const newClue: ClueTypeOriginal = {
                clue: curr.desc,
                answer: curr.word,
                row: curr.startPosition[0],
                col: curr.startPosition[1],
              }

              return {
                ...final,
                [curr.vertical ? 'down' : 'across']: {
                  ...final[curr.vertical ? 'down' : 'across'],
                  [`${idx + 1}`]: newClue,
                },
              }
            },
            { across: {}, down: {} },
          )
        : null,
    [data],
  )

  return (
    <div css={screenStyle}>
      <div css={crosswordContainerStyle}>
        {isFetching ? (
          <Player src={GeneratingAnimation} autoplay loop css={animationStyle} />
        ) : (
          crossword && (
            <CrosswordProvider
              data={crossword}
              theme={{
                allowNonSquare: true,
                gridBackground: theme.primary[200],
                cellBorder: theme.primary[500],
                highlightBackground: theme.primary[300],
                focusBackground: theme.primary[400],
                numberColor: theme.primary[200],
              }}
            >
              <div css={gridStyle}>
                <CrosswordGrid />
              </div>
              <div css={cluesContainerStyle}>
                <DirectionClues direction="across" />
                <DirectionClues direction="down" />
              </div>
            </CrosswordProvider>
          )
        )}
      </div>
    </div>
  )
}
