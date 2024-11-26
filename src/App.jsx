import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Settings from '~/components/Settings/Settings'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={<Navigate to='boards/673baa23124fb358072bb960' replace={true} />} />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child trong router này */}

        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />

        {/* User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
