import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './Components/Register'
import Username from './Components/Username'
import Password from './Components/Password'
import Recovery from './Components/Recovery'
import PageNotFound from './Components/PageNotFound'
import Reset from './Components/Reset'
import Profile from './Components/Profile'


// Root Router
const routes = createBrowserRouter([
  {
    path: '/',
    element: <Username />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/password',
    element: <Password />,
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/reset',
    element: <Reset />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  }
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={routes}>
      </RouterProvider>
    </>
  )
}

export default App
