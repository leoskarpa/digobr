import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../atoms'

export const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { user } = useUser()
  const location = useLocation()

  if (!user) {
    return <Navigate to={'/login'} replace state={{ from: location }} />
  }

  return children
}
