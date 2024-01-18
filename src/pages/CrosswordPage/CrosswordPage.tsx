import { css } from '@emotion/react'
import { Clue, CrosswordGrid, CrosswordProvider } from '@jaredreisinger/react-crossword'
import { ClueTypeOriginal, CluesInputOriginal } from '@jaredreisinger/react-crossword/dist/types'
import { Player } from '@lottiefiles/react-lottie-player'
import { Modal, Popover } from 'antd'
import { toPairs, values } from 'lodash'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { SubmitPuzzleVariables } from '../../api/http'
import {
  useGenerateCrossword,
  useGetCrossword,
  useGetDifficulties,
  useGetHint,
  useGetTopics,
  useSubmitPuzzle,
} from '../../api/queries'
import { Button } from '../../components/inputs/Button'
import { useRequiredParams } from '../../utils/hooks'
import { theme } from '../../utils/theme'

import GeneratingAnimation from '../../assets/animations/generating.json'
import LoadingAnimation from '../../assets/animations/loading.json'
import ProcessingAnimation from '../../assets/animations/processing.json'
import HeartEmptyIcon from '../../assets/icons/heart-empty.svg?react'
import HeartFilledIcon from '../../assets/icons/heart-filled.svg?react'

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
const cluesWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const clueContainerStyle = css`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  > p {
    margin-left: 0.25rem;
  }
`
const hintButtonStyle = css`
  padding: 0;
  font-size: 0.875rem;
  border-width: 0;
  margin-left: 1rem;
`
const hintButtonDisabledStyle = css`
  :hover {
    cursor: not-allowed;
  }
`
const animationStyle = css`
  width: 20rem;
`
const analysisContainerStyle = css`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
const analysisTextStyle = css`
  overflow-y: auto;
  white-space: pre-wrap;
`

type LocalStorageGuesses = { date: number; guesses: { [K: string]: string } }

type CrosswordPageParams = {
  id: string
}
export const CrosswordPage = () => {
  const { id } = useRequiredParams<CrosswordPageParams>()

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [hint, setHint] = useState<{ hint: string; answer: string }>()
  const [hintDisabled, setHintDisabled] = useState(false)
  const navigate = useNavigate()

  const { data, isFetching } = useGetCrossword({ crosswordId: +id })
  const { data: difficultiesData } = useGetDifficulties()
  const { data: topicsData } = useGetTopics()

  const { data: submitData, isPending: isSubmitting, mutate: submitPuzzle, reset: resetSubmit } = useSubmitPuzzle()
  const { mutate: generateCrossword, isPending: isGenerating } = useGenerateCrossword()
  const { mutate: getHint, isPending: isGettingHint } = useGetHint()

  const crossword = useMemo<CluesInputOriginal | null>(
    () =>
      data
        ? data.data.puzzleDto.puzzle.reduce<CluesInputOriginal>(
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

    setSubmitModalOpen(true)
    submitPuzzle(submitdata, {
      onSuccess() {
        toast.success('Successfully submitted!')
      },
      onError() {
        toast.error('Failed to submit')
      },
    })
  }
  const handleGetHint = (answer: string, clue: string) => {
    getHint(
      { clue, word: answer },
      {
        onSuccess(data) {
          setHint({ hint: data.data.hint, answer })
          setHintDisabled(true)
          setTimeout(() => setHintDisabled(false), 20000)
        },
      },
    )
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
            >
              <div css={gridStyle}>
                <CrosswordGrid />
              </div>
              <div css={cluesContainerStyle}>
                <div css={cluesWrapperStyle}>
                  <h3>Accross</h3>
                  {toPairs(crossword.across).map(val => (
                    <Clue key={val[0]} direction="across" number={val[0]} css={clueContainerStyle}>
                      <>
                        <p>{val[1].clue}</p>
                        <Popover
                          title="Hint"
                          trigger="click"
                          onOpenChange={visible => !visible && setHint(undefined)}
                          {...(hintDisabled && hint?.answer !== val[1].answer ? { open: false } : {})}
                          destroyTooltipOnHide={true}
                          content={() => (
                            <div>
                              {isGettingHint ? (
                                <>
                                  <Player
                                    css={css`
                                      width: 1rem;
                                      height: 1rem;
                                    `}
                                    src={LoadingAnimation}
                                    autoplay
                                    loop
                                  />
                                </>
                              ) : (
                                hint?.hint
                              )}
                            </div>
                          )}
                        >
                          <Button
                            label="HINT"
                            onClick={() => !hintDisabled && handleGetHint(val[1].answer, val[1].clue)}
                            type="ghost"
                            style={[hintButtonStyle, hintDisabled && hintButtonDisabledStyle]}
                          />
                        </Popover>
                      </>
                    </Clue>
                  ))}
                </div>
                <div css={cluesWrapperStyle}>
                  <h3>Down</h3>
                  {toPairs(crossword.down).map(val => (
                    <Clue key={val[0]} direction="down" number={val[0]} css={clueContainerStyle}>
                      <>
                        <p>{val[1].clue}</p>
                        <Popover
                          title="Hint"
                          trigger="click"
                          onOpenChange={visible => !visible && setHint(undefined)}
                          destroyTooltipOnHide={true}
                          content={() => (
                            <div>
                              {isGettingHint ? (
                                <>
                                  <Player
                                    css={css`
                                      width: 1rem;
                                      height: 1rem;
                                    `}
                                    src={LoadingAnimation}
                                    autoplay
                                    loop
                                  />
                                </>
                              ) : (
                                hint?.hint
                              )}
                            </div>
                          )}
                        >
                          <Button
                            label="HINT"
                            onClick={() => handleGetHint(val[1].answer, val[1].clue)}
                            type="ghost"
                            style={hintButtonStyle}
                          />
                        </Popover>
                      </>
                    </Clue>
                  ))}
                </div>
              </div>
            </CrosswordProvider>
          )
        )}
      </div>
      <Modal
        title={isSubmitting ? 'Submitting...' : 'Your analysis'}
        open={submitModalOpen}
        styles={{
          content: { maxHeight: '60dvh', display: 'flex', flexDirection: 'column' },
          body: { display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1, gap: '2rem' },
        }}
        centered
        confirmLoading={isSubmitting || isGenerating}
        maskClosable={!isSubmitting && !isGenerating}
        closable={!isSubmitting && !isGenerating}
        {...(isSubmitting ? { footer: null } : {})}
        okText="Regenerate new"
        onOk={() => {
          generateCrossword(
            {
              difficultyId: submitData?.data.suggestedCrossword
                ? submitData?.data.suggestedCrossword.puzzleDifficulty
                : data!.data.puzzleInfo.difficultyId,
              topicId: submitData?.data.suggestedCrossword
                ? submitData?.data.suggestedCrossword?.puzzleTopic
                : data!.data.puzzleInfo.topicId,
            },
            {
              onSuccess(data) {
                setSubmitModalOpen(false)
                toast.success('Successfully created a new crossword!')
                navigate(`/quiz/${data.data}`, { replace: true })
              },
              onError(error) {
                toast.error(error.message)
              },
            },
          )
        }}
        cancelText="Close"
        okButtonProps={{
          style: { backgroundColor: theme.primary[500], color: 'white' },
        }}
        cancelButtonProps={{
          disabled: isSubmitting || isGenerating,
          style: { borderColor: theme.primary[500], color: theme.primary[500] },
        }}
        onCancel={() => {
          resetSubmit()
          setSubmitModalOpen(false)
          navigate('/')
        }}
      >
        <>
          {isSubmitting ? (
            <Player src={ProcessingAnimation} autoplay loop />
          ) : (
            <>
              <div css={analysisContainerStyle}>
                <p css={analysisTextStyle}>{submitData?.data.analysis}</p>
              </div>
              <div>
                <h4>If you enjoyed this crossword, consider liking it!</h4>
                <HeartEmptyIcon /> <HeartFilledIcon />
              </div>
              {submitData?.data.suggestedCrossword && (
                <div>
                  <h4>Suggested crossword</h4>
                  <p>
                    Because of your outstanding knowledge, we recommend you to try a new crossword with:
                    <br />
                    <b>difficulty:</b>{' '}
                    {
                      difficultiesData?.data.find(d => d.id === submitData.data.suggestedCrossword?.puzzleDifficulty)
                        ?.description
                    }
                    <br />
                    <b>topic:</b>{' '}
                    {topicsData?.data.find(t => t.id === submitData.data.suggestedCrossword?.puzzleTopic)?.topicName}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      </Modal>
    </div>
  )
}
