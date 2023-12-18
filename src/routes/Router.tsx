import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Main } from '../components/Main'
import { LoginPage } from '../pages/auth/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Main />}>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div></div>
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
)
