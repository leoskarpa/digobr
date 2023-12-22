import { css } from '@emotion/react'
import { theme } from '../../utils/theme'

const containerStyle = css`
  display: flex;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  background-color: ${theme.primary[500]};
`
const headerTitleStyle = css`
  font-family: Ubuntu;
  font-weight: bold;
  font-size: 2.5rem;
  color: white;
`

export const Header = () => {
  return (
    <div css={containerStyle}>
      <div css={headerTitleStyle}>CrossMe</div>
    </div>
  )
}
