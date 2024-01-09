import { css } from '@emotion/react'
import { useUser } from '../../atoms'
import { theme } from '../../utils/theme'

const containerStyle = css`
  display: flex;
  padding: 1rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.primary[500]};
`
const headerTitleStyle = css`
  font-family: Ubuntu;
  font-weight: bold;
  font-size: 2.5rem;
  color: white;
`
const logoutTextStyle = css`
  font-family: Ubuntu;
  font-weight: 500;
  font-size: 1rem;
  color: white;
  outline: none;
  border: none;
  background-color: transparent;

  :hover {
    cursor: pointer;
  }
`

export const Header = () => {
  const { user, resetUser } = useUser()

  const onLogout = () => {
    resetUser()
  }

  return (
    <div
      css={[
        containerStyle,
        user &&
          css`
            justify-content: space-between;
          `,
      ]}
    >
      <div css={headerTitleStyle}>CrossMe</div>
      {user && (
        <button css={logoutTextStyle} onClick={onLogout}>
          Logout
        </button>
      )}
    </div>
  )
}
