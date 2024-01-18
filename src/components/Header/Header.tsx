import { css } from '@emotion/react'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import ChevronDownIcon from '../../assets/icons/chevron-down.svg?react'
import { useAccessToken, useUser } from '../../atoms'
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
  text-decoration: none;
`
const logoutTextStyle = css`
  font-family: Ubuntu;
  font-weight: 500;
  font-size: 1rem;
  color: white;
  outline: none;
  border: none;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;

  :hover {
    cursor: pointer;
  }
`
const chevronDownStyle = css`
  width: 1rem;
  height: 1rem;
`
const linksContainerStyle = css`
  display: flex;
  gap: 1rem;
`
const homeButtonStyle = css`
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-family: Ubuntu;
`

export const Header = () => {
  const { user, resetUser } = useUser()
  const { resetAccessToken } = useAccessToken()

  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      key: 'stats',
      onClick: () => {
        navigate('/stats')
      },
      label: 'Stats',
    },
    {
      key: 'logout',
      onClick: () => {
        resetUser()
        resetAccessToken()
      },
      label: 'Logout',
    },
  ]

  return (
    <div
      css={[
        containerStyle,
        !user &&
          css`
            justify-content: center;
          `,
      ]}
    >
      <Link to={'/'} css={headerTitleStyle}>
        CrossMe
      </Link>
      {user && (
        <div css={linksContainerStyle}>
          <Link to={'/'} css={homeButtonStyle}>
            Home
          </Link>
          <Dropdown css={logoutTextStyle} trigger={['click']} menu={{ items }}>
            <div>
              {user.name} <ChevronDownIcon css={chevronDownStyle} />
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  )
}
