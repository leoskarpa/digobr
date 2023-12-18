import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import { queryClient } from './api/queries'
import { router } from './routes/Router'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <ToastContainer position="bottom-right" limit={3} autoClose={2500} />
    </RecoilRoot>
  )
}

export default App
