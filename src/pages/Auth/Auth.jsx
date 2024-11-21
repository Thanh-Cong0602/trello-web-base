import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '~/redux/user/userSlice'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const Auth = () => {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'
  const currentUser = useSelector(selectCurrentUser)

  if (currentUser) return <Navigate to='/' replace={true} />

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}
    >
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth
