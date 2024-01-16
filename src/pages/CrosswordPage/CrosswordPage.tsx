import { css } from '@emotion/react'
import {
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  DirectionClues,
} from '@jaredreisinger/react-crossword'
import { ClueTypeOriginal, CluesInputOriginal, Direction } from '@jaredreisinger/react-crossword/dist/types'
import { Player } from '@lottiefiles/react-lottie-player'
import { useMemo, useRef, useState } from 'react'

import { useGetCrossword } from '../../api/queries'
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

type AnswerType = {
  word: string
  desc: string
  usersAnswer: string
}
type SubmitType = {
  corsswordId: number
  incorrectAnswers: AnswerType[]
  correctAnswers: AnswerType[]
}

type CrosswordPageParams = {
  id: string
}
export const CrosswordPage = () => {
  const { id } = useRequiredParams<CrosswordPageParams>()
  const { data, isFetching } = useGetCrossword({ crosswordId: +id })
  const crosswordProviderRef = useRef<CrosswordProviderImperative>(null)

  const [correctAnswers, setCorrectAnswers] = useState<AnswerType>()
  const [incorrectAnswers, setIncorrectAnswers] = useState<AnswerType>()

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
    const crosswordUserData = JSON.parse(localStorage.getItem('guesses'))
    console.log(crosswordUserData)
  }
  const handleAnswerComplete = (direction: Direction, number: string, correct: boolean, answer: string) => {
    console.log(direction, number, correct, answer)
    const realClue = crossword![direction][`${+number}`]
    console.log(realClue)
    setTimeout(() => getUsersAnswerFromLocalStorage(direction, realClue.row, realClue.col, answer.length), 0)
  }
  const getUsersAnswerFromLocalStorage = (direction: Direction, row: number, col: number, answerLength: number) => {
    const crosswordUserGuessesData = localStorage.getItem('guesses')

    if (!crosswordUserGuessesData) return null

    const crosswordUserGuesses: { date: number; guesses: { [K: string]: string } } =
      JSON.parse(crosswordUserGuessesData)

    if (direction === 'across') {
      let usersAnswer = ''

      for (let i = 0; i < answerLength; i++) {
        usersAnswer += crosswordUserGuesses.guesses[`${row}_${col + i}`]
        console.log(`${row}_${col + i}`)
        console.log(crosswordUserGuesses.guesses[`${row}_${col + i}`])
      }
      console.log(usersAnswer)
    }
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
              onAnswerComplete={handleAnswerComplete}
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
