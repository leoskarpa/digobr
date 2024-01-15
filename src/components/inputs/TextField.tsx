import type { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/react'
import { HTMLInputTypeAttribute, useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import ClosedEyeIcon from '../../assets/icons/eye-closed.svg?react'
import EyeIcon from '../../assets/icons/eye.svg?react'
import { theme } from '../../utils/theme'

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`
const labelStyle = css`
  font-size: 1rem;
  color: black;
`
const errorLabelStyle = css`
  color: crimson;
`
const inputContainerStyle = css`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  background-color: white;
  border-color: ${theme.primary[500]};
  border-width: 1.5px;
  border-style: solid;
  border-radius: 6px;
`
const errorInputContainerStyle = css`
  border-color: crimson;
`
const inputStyle = css`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0.5rem 0rem;
  flex: 1;
  font-size: 1rem;
  color: black;
`
const bottomTextStyle = css`
  font-size: 0.75rem;
  min-height: 0.75rem;
  height: 0.75rem;
`
const hintStyle = css`
  color: lightGray;
`
const errorStyle = css`
  color: crimson;
`
const eyeIconStyle = css`
  color: ${theme.primary[500]};

  :hover {
    cursor: pointer;
  }
`

type HTMLInputAutocompleteAttribute =
  // Default. Autocomplete is on (enabled)
  | 'on'
  // Autocomplete is off (disabled)
  | 'off'
  // Expects the first line of the street address
  | 'address-line1'
  // Expects the second line of the street address
  | 'address-line2'
  // Expects the third line of the street address
  | 'address-line3'
  // Expects the first level of the address, e.g. the county
  | 'address-level1'
  // Expects the second level of the address, e.g. the city
  | 'address-level2'
  // Expects the third level of the address
  | 'address-level3'
  // Expects the fourth level of the address
  | 'address-level4'
  // Expects the full street address
  | 'street-address'
  // Expects the country code
  | 'country'
  // Expects the country name
  | 'country-name'
  // Expects the post code
  | 'postal-code'
  // Expects the full name
  | 'name'
  // Expects the middle name
  | 'additional-name'
  // Expects the last name
  | 'family-name'
  // Expects the first name
  | 'give-name'
  // Expects the title, like "Mr", "Ms" etc.
  | 'honoric-prefix'
  // Expects the suffix, like "5", "Jr." etc.
  | 'honoric-suffix'
  // Expects the nickname
  | 'nickname'
  // Expects the job title
  | 'organization-title'
  // Expects the username
  | 'username'
  // Expects a new password
  | 'new-password'
  // Expects the current password
  | 'current-password'
  // Expects the full birthday date
  | 'bday'
  // Expects the day of the birthday date
  | 'bday-day'
  // Expects the month of the birthday date
  | 'bday-month'
  // Expects the year of the birthday date
  | 'bday-year'
  // Expects the gender
  | 'sex'
  // Expects a one time code for verification etc.
  | 'one-time-code'
  // Expects the company name
  | 'organization'
  // Expects the credit card owner's full name
  | 'cc-name'
  // Expects the credit card owner's first name
  | 'cc-given-name'
  // Expects the credit card owner's middle name
  | 'cc-additional-name'
  // Expects the credit card owner's full name
  | 'cc-family-name'
  // Expects the credit card's number
  | 'cc-number'
  // Expects the credit card's expiration date
  | 'cc-exp'
  // Expects the credit card's expiration month
  | 'cc-exp-month'
  // Expects the credit card's expiration year
  | 'cc-exp-year'
  // Expects the CVC code
  | 'cc-csc'
  // Expects the credit card's type of payment
  | 'cc-type'
  // Expects the currency
  | 'transaction-currency'
  // Expects a number, the amount
  | 'transaction-amount'
  // Expects the preferred language
  | 'language'
  // Expects a we address
  | 'url'
  // Expects the email address
  | 'email'
  // Expects an image
  | 'photo'
  // Expects the full phone number
  | 'tel'
  // Expects the country code of the phone number
  | 'tel-country-code'
  // Expects the phone number with no country code
  | 'tel-national'
  // Expects the area code of the phone number
  | 'tel-area-code'
  // Expects the phone number with no country code and no area code
  | 'tel-local'
  // Expects the local prefix of the phone number
  | 'tel-local-prefix'
  // Expects the local suffix of the phone number
  | 'tel-local-suffix'
  // Expects the extension code of the phone number
  | 'tel-extension'
  // Expects the url of an instant messaging protocol endpoint
  | 'impp'

interface TextFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type: HTMLInputTypeAttribute
  hint?: string
  style?: SerializedStyles
  disabled?: boolean
  autocomplete?: HTMLInputAutocompleteAttribute
}
export const TextField = <T extends FieldValues = FieldValues>(props: TextFieldProps<T>) => {
  const { control, name, label, type, hint, style, disabled = false, autocomplete = 'on' } = props

  const [isSecure, setIsSecure] = useState(type === 'password')

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div css={[containerStyle, style]}>
          <div css={[labelStyle, error && errorLabelStyle]}>{label}</div>
          <div css={[inputContainerStyle, error && errorInputContainerStyle]}>
            <input
              disabled={disabled}
              type={type === 'password' && !isSecure ? 'text' : type}
              autoComplete={autocomplete}
              css={inputStyle}
              {...field}
            />
            {type === 'password' &&
              (isSecure ? (
                <EyeIcon css={eyeIconStyle} onClick={() => setIsSecure(false)} />
              ) : (
                <ClosedEyeIcon css={eyeIconStyle} onClick={() => setIsSecure(true)} />
              ))}
          </div>
          <div css={[bottomTextStyle, hint && hintStyle, error && errorStyle]}>{error ? error.message : hint}</div>
        </div>
      )}
    />
  )
}
