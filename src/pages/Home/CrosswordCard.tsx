import { css } from '@emotion/react'
import { Link } from 'react-router-dom'
import { Crossword } from '../../api/models/Crossword'
import HeartEmpty from '../../assets/icons/heart-empty.svg?react'
import HeartFilled from '../../assets/icons/heart-filled.svg?react'
import CoverPlaceholder from '../../assets/illustrations/crossword-cover.png'
import { theme } from '../../utils/theme'

const cardStyle = css`
  width: 16rem;
  height: 16rem;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
`
const imageContainerStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const imageStyle = css`
  width: 60%;
`
const infoContainerStyle = css`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`
const infoTextStyle = css`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.primary[900]};
`
const infoHighlightTextStyle = css`
  font-size: 1rem;
  color: ${theme.primary[600]};
`
const infoStyle = css`
  display: flex;
  flex-direction: column;
`
const likesContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  align-self: flex-start;
  color: ${theme.primary[900]};
`
const heartStyle = css`
  color: ${theme.primary[500]};
`

interface CrosswordCardProps {
  crossword: Crossword & { likedByUser: boolean }
}
export const CrosswordCard = (props: CrosswordCardProps) => {
  const { crossword } = props

  return (
    <Link to={`/quiz/${crossword.id}`} css={cardStyle}>
      <div css={imageContainerStyle}>
        <img src={CoverPlaceholder} alt="Cover" css={imageStyle} />
      </div>
      <div css={infoContainerStyle}>
        <div css={infoStyle}>
          <div css={infoTextStyle}>
            ID: <span css={infoHighlightTextStyle}>{crossword.id}</span>
          </div>
          <div css={infoTextStyle}>
            Difficulty: <span css={infoHighlightTextStyle}>{crossword.difficulty.description}</span>
          </div>
          <div css={infoTextStyle}>
            Topic: <span css={infoHighlightTextStyle}>{crossword.topic.topicName}</span>
          </div>
        </div>
        <div css={likesContainerStyle}>
          {crossword.likedByUser ? <HeartFilled css={heartStyle} /> : <HeartEmpty css={heartStyle} />}
          {crossword.likes}
        </div>
      </div>
    </Link>
  )
}
