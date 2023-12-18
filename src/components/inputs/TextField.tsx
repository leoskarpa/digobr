import type { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/react'
import { HTMLInputTypeAttribute } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

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
  background-color: white;
  border-color: #9c62d3;
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
  padding: 0.5rem 0.75rem;
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

interface TextFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type: HTMLInputTypeAttribute
  hint?: string
  style?: SerializedStyles
}
export const TextField = <T extends FieldValues = FieldValues>(props: TextFieldProps<T>) => {
  const { control, name, label, type, hint, style } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div css={[containerStyle, style]}>
          <div css={[labelStyle, error && errorLabelStyle]}>{label}</div>
          <div css={[inputContainerStyle, error && errorInputContainerStyle]}>
            <input type={type} css={inputStyle} {...field} />
          </div>
          <div css={[bottomTextStyle, hint && hintStyle, error && errorStyle]}>{error ? error.message : hint}</div>
        </div>
      )}
    />
  )
}
