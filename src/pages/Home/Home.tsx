import { css } from '@emotion/react'
import { CrosswordGrid, CrosswordProvider, DirectionClues } from '@jaredreisinger/react-crossword'
import { ClueTypeOriginal, CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'
import { useState } from 'react'
import { useGetCrossword } from '../../api/queries'
import { Button } from '../../components/inputs/Button'
import { theme } from '../../utils/theme'

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
  max-width: 80rem;
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

export const HomePage = () => {
  const [crossword, setCrossword] = useState<CluesInputOriginal>()
  const { mutate: getCrossword, isPending } = useGetCrossword()

  const generateCrossword = () => {
    setCrossword(undefined)
    getCrossword(
      { difficulty: 1, topic: 1 },
      {
        onSuccess(data) {
          setCrossword(
            data.data.puzzle.reduce<CluesInputOriginal>(
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
            ),
          )
        },
      },
    )
  }

  return (
    <div css={screenStyle}>
      <Button label="Generate" onClick={generateCrossword} type="filled" loading={isPending} />

      <div css={crosswordContainerStyle}>
        {crossword && (
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
              {/* <div
                css={css`
                  flex: 1;
                  min-width: 0;
                  max-height: 100%;
                  height: 100%;
                  min-height: 100%;
                `}
              > */}
              <CrosswordGrid />
              {/* </div> */}
            </div>
            <div css={cluesContainerStyle}>
              <DirectionClues direction="across" />
              <DirectionClues direction="down" />
            </div>
          </CrosswordProvider>
        )}
      </div>
    </div>
  )
}
