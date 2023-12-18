import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { RegisterVariables } from '../../api/http'
import { useRegister } from '../../api/queries'
import { Button } from '../../components/inputs/Button'
import { TextField } from '../../components/inputs/TextField'

const screenStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const containerStyle = css`
  max-width: 24rem;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
`
const titleStyle = css`
  font-size: 2rem;
  color: black;
  font-weight: 600;
  margin-bottom: 0.5rem;
`
const descStyle = css`
  color: black;
  margin-bottom: 2.5rem;
`
const buttonStyle = css`
  align-self: center;
  margin-top: 2rem;
`
const extraInfoStyle = css`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`
const extraInfoActionTextStyle = css`
  font-weight: 600;
  color: #9c62d3;
  text-decoration-line: none;

  :hover {
    cursor: pointer;
  }
`

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required').min(5, 'Password must be 5 or more characters'),
})

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { mutate: register } = useRegister()
  const { control, handleSubmit, setError } = useForm<RegisterVariables>({
    mode: 'all',
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const handleRegisterSubmit = (variables: RegisterVariables) => {
    setLoading(true)

    register(variables, {
      onSuccess(data) {
        toast.success(data.data.message)
        navigate('/login')
      },
      onError(error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response?.status === 400) {
            toast.error(error.response.data.message)

            switch (error.response.data.message.split(' ', 1)[0]) {
              case 'Email':
                setError('email', { message: error.response.data.message }, { shouldFocus: true })
                break
              case 'Username':
                setError('username', { message: error.response.data.message }, { shouldFocus: true })
                break

              default:
                break
            }
          } else {
            toast.error('An unexpected error occured. Please try again later.')
          }
        }
      },
      onSettled() {
        setLoading(false)
      },
    })
  }

  return (
    <div css={screenStyle}>
      <div css={containerStyle}>
        <div css={titleStyle}>Welcome to CrossMe!</div>
        <div css={descStyle}>Please complete the form to create your new account:</div>
        <TextField
          control={control}
          name="name"
          label="Name"
          type="text"
          autocomplete="name"
          style={css`
            margin-bottom: 0.1rem;
          `}
        />
        <TextField
          control={control}
          name="username"
          label="Username"
          type="text"
          autocomplete="username"
          style={css`
            margin-bottom: 0.1rem;
          `}
        />
        <TextField
          control={control}
          name="email"
          label="Email"
          type="text"
          autocomplete="email"
          style={css`
            margin-bottom: 0.1rem;
          `}
        />
        <TextField control={control} name="password" label="Password" type="password" autocomplete="new-password" />
        <Button
          label="Sign up"
          type="filled"
          loading={loading}
          style={buttonStyle}
          onClick={handleSubmit(handleRegisterSubmit)}
        />
        <div css={extraInfoStyle}>
          Already have an account?
          <br />
          <Link to={'/login'} css={extraInfoActionTextStyle}>
            Log in now!
          </Link>
        </div>
      </div>
    </div>
  )
}
