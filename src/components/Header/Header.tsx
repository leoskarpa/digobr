import { css } from '@emotion/react'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { Link } from 'react-router-dom'

import ChevronDownIcon from '../../assets/icons/chevron-down.svg?react'
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

export const Header = () => {
  const { user, resetUser } = useUser()

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      onClick: () => resetUser(),
      label: 'Logout',
    },
  ]

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
      <Link to={'/'} css={headerTitleStyle}>
        CrossMe
      </Link>
      {user && (
        <Dropdown css={logoutTextStyle} trigger={['click']} menu={{ items }}>
          <div>
            {user.name} <ChevronDownIcon css={chevronDownStyle} />
          </div>
        </Dropdown>
      )}
    </div>
  )
}
