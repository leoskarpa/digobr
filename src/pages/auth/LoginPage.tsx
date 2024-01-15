import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { omit } from 'lodash'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { LoginVariables } from '../../api/http'
import { useLogin } from '../../api/queries'
import { useAccessToken, useUser } from '../../atoms'
import { Button } from '../../components/inputs/Button'
import { TextField } from '../../components/inputs/TextField'
import { theme } from '../../utils/theme'

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
  color: ${theme.primary[500]};
  text-decoration-line: none;

  :hover {
    cursor: pointer;
  }
`

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required').min(5, 'Password must be 5 or more characters'),
})

export const LoginPage = () => {
  const { user, setUser } = useUser()
  const { accessToken, setAccessToken } = useAccessToken()
  const navigate = useNavigate()

  const { mutate: login, isPending: loading } = useLogin()
  const { control, handleSubmit, setError } = useForm<LoginVariables>({
    mode: 'all',
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (user && accessToken) navigate('/')
  }, [user, accessToken, navigate])

  const handleLoginSubmit = (variables: LoginVariables) => {
    login(variables, {
      onSuccess(data) {
        setUser(omit(data.data, 'accessToken'))
        setAccessToken(data.data.accessToken)
      },
      onError(error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error('Wrong username or password')
            setError('usernameOrEmail', { message: 'Wrong username or password' }, { shouldFocus: true })
            setError('password', { message: 'Wrong username or password' })
          } else {
            toast.error('An unexpected error occured. Please try again later.')
          }
        }
      },
    })
  }

  return (
    <div css={screenStyle}>
      <div css={containerStyle}>
        <div css={titleStyle}>Welcome to CrossMe!</div>
        <div css={descStyle}>Please login to continue to the app:</div>
        <TextField
          control={control}
          name="usernameOrEmail"
          label="Username or email"
          type="text"
          disabled={loading}
          style={css`
            margin-bottom: 0.1rem;
          `}
        />
        <TextField
          control={control}
          name="password"
          label="Password"
          type="password"
          disabled={loading}
          autocomplete="current-password"
        />
        <Button
          label="Login"
          type="filled"
          loading={loading}
          style={buttonStyle}
          onClick={handleSubmit(handleLoginSubmit)}
        />
        <div css={extraInfoStyle}>
          Don&apos;t have an account?
          <br />
          <Link to={'/register'} css={extraInfoActionTextStyle}>
            Create one now!
          </Link>
        </div>
      </div>
    </div>
  )
}
