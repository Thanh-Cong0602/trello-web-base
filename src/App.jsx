import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='boards/673baa23124fb358072bb960' replace={true} />} />

      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
