import { css } from '@emotion/react'
import {
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  DirectionClues,
} from '@jaredreisinger/react-crossword'
import { ClueTypeOriginal, CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'
import { Player } from '@lottiefiles/react-lottie-player'
import { useMemo, useRef } from 'react'

import { values } from 'lodash'
import { toast } from 'react-toastify'
import { SubmitPuzzleVariables } from '../../api/http'
import { useGetCrossword, useSubmitPuzzle } from '../../api/queries'
import GeneratingAnimation from '../../assets/animations/generating.json'
import { Button } from '../../components/inputs/Button'
import { useRequiredParams } from '../../utils/hooks'
import { theme } from '../../utils/theme'

const screenStyle = css`
  padding: 1rem;
`
const headerStyle = css`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const titleStyle = css`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.primary[800]};
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

type LocalStorageGuesses = { date: number; guesses: { [K: string]: string } }

type CrosswordPageParams = {
  id: string
}
export const CrosswordPage = () => {
  const { id } = useRequiredParams<CrosswordPageParams>()

  const { data, isFetching } = useGetCrossword({ crosswordId: +id })
  const { mutate: submitPuzzle } = useSubmitPuzzle()

  const crosswordProviderRef = useRef<CrosswordProviderImperative>(null)

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

  const handleSubmitCrossword = () => {
    const crosswordUserGuessesData = localStorage.getItem('guesses')
    if (!crosswordUserGuessesData || !crossword) return null

    const crosswordUserGuesses = JSON.parse(crosswordUserGuessesData) as LocalStorageGuesses

    const submitdata: SubmitPuzzleVariables = { crosswordId: +id, correctAnswers: [], incorrectAnswers: [] }

    const questions = [
      ...values(crossword.across).map(d => ({ ...d, vertical: false })),
      ...values(crossword.down).map(d => ({ ...d, vertical: true })),
    ]

    questions.forEach(val => {
      let usersAnswer = ''

      for (let i = 0; i < val.answer.length; i++) {
        usersAnswer +=
          crosswordUserGuesses.guesses[
            `${val.vertical ? val.row + i : val.row}_${val.vertical ? val.col : val.col + i}`
          ]
      }

      if (usersAnswer === val.answer) {
        submitdata.correctAnswers.push({ desc: val.clue, usersAnswer, word: val.answer })
      } else {
        submitdata.incorrectAnswers.push({ desc: val.clue, usersAnswer, word: val.answer })
      }
    })

    console.log(submitdata)
    submitPuzzle(submitdata, {
      onSuccess() {
        toast.success('Successfully submitted!')
      },
      onError() {
        toast.error('Failed to submit')
      },
    })
  }

  return (
    <div css={screenStyle}>
      <div css={headerStyle}>
        <h1 css={titleStyle}>Crossword ID {id}</h1>
        <Button label="Submit" onClick={handleSubmitCrossword} type="filled" />
      </div>
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
              ref={crosswordProviderRef}
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
