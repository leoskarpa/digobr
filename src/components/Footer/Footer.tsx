import { css } from '@emotion/react'
import { getYear } from 'date-fns'
import FerLogo from '../../assets/FER_logo.png'

const containerStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 1.5rem;
  background-color: #dbdbdb;
`
const footerTextStyle = css`
  align-self: center;
  text-align: left;
  font-family: Rubik;
  font-size: 0.8rem;
  color: black;
`
const ferLogoContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ferLogoStyle = css`
  width: 4rem;
`
const dateStyle = css`
  align-self: center;
  text-align: right;
  font-family: Rubik;
  font-size: 0.8rem;
  color: black;
`

export const Footer = () => {
  return (
    <div css={containerStyle}>
      <div css={footerTextStyle}>
        Project for <b>Digital Education</b> course
      </div>
      <div css={ferLogoContainerStyle}>
        <img src={FerLogo} alt="fer logo" css={ferLogoStyle} />
      </div>
      <div css={dateStyle}>Zagreb, {getYear(new Date())}</div>
    </div>
  )
}
