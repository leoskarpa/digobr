import { css } from '@emotion/react'
import { theme } from '../../utils/theme'

const cardContainerStyle = css`
  width: 10rem;
  height: 10rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const valueStyle = css`
  flex: 2.5;
  font-family: Ubuntu, monospace;
  font-size: 2rem;
  font-weight: 600;
  color: ${theme.primary[500]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const titleStyle = css`
  flex: 1;
  font-family: Ubuntu, monospace;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${theme.primary[700]};
`

export type StatProps = {
  title: string
  value: string | number
}
export const StatCard = (props: StatProps) => {
  const { title, value } = props

  return (
    <div css={cardContainerStyle}>
      <div css={valueStyle}>{value}</div>
      <div css={titleStyle}>{title}</div>
    </div>
  )
}
