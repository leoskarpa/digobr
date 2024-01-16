import { css } from '@emotion/react'
import { Player } from '@lottiefiles/react-lottie-player'
import { Modal, Select } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'
import { capitalize, orderBy } from 'lodash'
import { useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenerateCrosswordVariables, GetAllPreloadedPuzzlesResponse } from '../../api/http'
import { useGenerateCrossword, useGetAllPreloadedPuzzles, useGetDifficulties, useGetTopics } from '../../api/queries'
import GeneratingAnimation from '../../assets/animations/generating.json'
import PlusCircleIcon from '../../assets/icons/plus-circle.svg?react'
import { Button } from '../../components/inputs/Button'
import { theme } from '../../utils/theme'
import { CrosswordCard } from './CrosswordCard'

const screenStyle = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`
const titleContainerStyle = css`
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
const dropdownStyle = css`
  min-width: 8rem;
  max-width: 16rem;
`
const modalContainerStyle = css`
  display: flex;
  flex-direction: column;
`
const selectContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
`

export const HomePage = () => {
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate()

  // * Queries
  const { data: preloadedPuzzlesData, isLoading } = useGetAllPreloadedPuzzles()
  const { data: difficultiesData } = useGetDifficulties()
  const { data: topicsData } = useGetTopics()

  // * Mutations
  const { mutate: generateCrossword, isPending } = useGenerateCrossword()

  const {
    control,
    handleSubmit,
    reset: resetForm,
    watch,
  } = useForm<GenerateCrosswordVariables>({
    mode: 'all',
    defaultValues: { difficultyId: undefined, topicId: undefined },
  })
  const formValues = watch()

  // * Memoizations
  const crosswords = useMemo<GetAllPreloadedPuzzlesResponse>(
    () => (preloadedPuzzlesData ? orderBy(preloadedPuzzlesData.data, 'id', 'asc') : []),
    [preloadedPuzzlesData],
  )
  const difficulties = useMemo<DefaultOptionType[]>(
    () => (difficultiesData ? difficultiesData.data.map(d => ({ label: capitalize(d.description), value: d.id })) : []),
    [difficultiesData],
  )
  const topics = useMemo<DefaultOptionType[]>(
    () => (topicsData ? topicsData.data.map(t => ({ label: capitalize(t.topicName), value: t.id })) : []),
    [topicsData],
  )

  // * Handlers
  const handleOpenGenerateModal = () => {
    setOpenModal(true)
  }
  const handleGenerateCrossword: SubmitHandler<GenerateCrosswordVariables> = variables => {
    // TODO - finish generating crossword
    generateCrossword(variables, {
      onSuccess(data) {
        toast.success('Successfully created a new crossword!')
        setOpenModal(false)
        navigate(`/quiz/${data.data.toString()}`)
      },
      onError(error) {
        toast.error(error.message)
      },
    })
  }

  return (
    <div css={screenStyle}>
      <div css={titleContainerStyle}>
        <h1 css={titleStyle}>All crosswords</h1>
        <Button label="Generate" onClick={handleOpenGenerateModal} type="filled" LeftIcon={PlusCircleIcon} />
      </div>
      <div
        css={[
          crosswordsContainerStyle,
          isLoading &&
            css`
              justify-content: center;
            `,
        ]}
      >
        {isLoading ? (
          <Player src={GeneratingAnimation} autoplay loop css={animationStyle} />
        ) : (
          crosswords.map(c => <CrosswordCard key={c.id} crossword={c} />)
        )}
      </div>
      <Modal
        title="Generate new crossword"
        open={openModal}
        confirmLoading={isPending}
        maskClosable={!isPending}
        closable={!isPending}
        okText="Generate"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onOk={handleSubmit(handleGenerateCrossword)}
        okButtonProps={{
          disabled: !formValues.difficultyId || !formValues.topicId,
          style: { backgroundColor: theme.primary[500], color: 'white' },
        }}
        cancelButtonProps={{
          disabled: isPending,
          style: { borderColor: theme.primary[500], color: theme.primary[500] },
        }}
        onCancel={() => {
          resetForm()
          setOpenModal(false)
        }}
      >
        <div css={modalContainerStyle}>
          <p>
            In order to generate a new crossword, you need to select which topic and difficulty will the crossword have.
          </p>
          <div css={selectContainerStyle}>
            <h5>Difficulty</h5>
            <Controller
              name={'difficultyId'}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  disabled={isPending}
                  placeholder="Select a difficulty"
                  css={dropdownStyle}
                  options={difficulties}
                />
              )}
            />
          </div>
          <div css={selectContainerStyle}>
            <h5>Topic</h5>
            <Controller
              name={'topicId'}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  disabled={isPending}
                  placeholder="Select a topic"
                  css={dropdownStyle}
                  options={topics}
                />
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
