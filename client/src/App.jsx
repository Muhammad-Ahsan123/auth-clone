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
import { Authorization, AuthorizationForLoginPage, AuthorizationForPasswordPage } from './middleware/auth.jsx'


// Root Router
const routes = createBrowserRouter([
  {
    path: '/',
    element:
      <AuthorizationForLoginPage>
        <Username />
      </AuthorizationForLoginPage>
    ,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/password',
    element:
      <AuthorizationForPasswordPage>
        <Password />
      </AuthorizationForPasswordPage>
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '/profile',
    element: <Authorization>
      <Profile />
    </Authorization >,
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
