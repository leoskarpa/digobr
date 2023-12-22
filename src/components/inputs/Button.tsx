import type { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/react'
import { Player } from '@lottiefiles/react-lottie-player'
import LoadingAnimation from '../../assets/animations/loading.json'
import { theme } from '../../utils/theme'

type ButtonType = 'filled' | 'outlined' | 'ghost'

const buttonStyle = css`
  padding: 0.5rem 1rem;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Rubik;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 0.25rem;
  border-width: 1px;
  border-style: solid;
  border-color: grey;

  :hover {
    cursor: pointer;
  }
`
const filledStyle = css`
  background-color: ${theme.primary[500]};
  border-color: ${theme.primary[500]};
  color: white;
`
const outlinedStyle = css`
  background-color: transparent;
  border-color: ${theme.primary[500]};
  color: ${theme.primary[500]};
`
const ghostStyle = css`
  background-color: transparent;
  border-color: transparent;
  color: ${theme.primary[500]};
`
const loadingStyle = css`
  background-color: transparent;
  border-color: transparent;

  :hover {
    cursor: default;
  }
`
const loadingAnimationStyle = css`
  width: 1.2em;
  height: 1.2em;
`

interface ButtonProps {
  label: string
  type: ButtonType
  loading?: boolean
  onClick: () => unknown
  style?: SerializedStyles
}
export const Button = (props: ButtonProps) => {
  const { label, type = 'filled', loading = false, style, onClick } = props

  return (
    <button
      onClick={!loading ? onClick : undefined}
      css={[
        buttonStyle,
        type === 'filled' ? filledStyle : type === 'outlined' ? outlinedStyle : ghostStyle,
        loading && loadingStyle,
        style,
      ]}
    >
      {loading ? <Player src={LoadingAnimation} autoplay loop css={loadingAnimationStyle} /> : label}
    </button>
  )
}
