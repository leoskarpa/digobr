import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../atoms'

export const ProtectedRoute = () => {
  const { user } = useUser()
  const location = useLocation()

  return user ? <Outlet /> : <Navigate to={'/login'} state={{ from: location }} />
}
