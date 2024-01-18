import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Main } from '../components/Main'
import { CrosswordPage } from '../pages/CrosswordPage'
import { HomePage } from '../pages/Home'
import { StatsPage } from '../pages/StatsPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Main />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:id" element={<CrosswordPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Route>
    </Route>,
  ),
)
