import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])

  /* Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn */
  if (!email || !token) return <Navigate to='/404' />

  /* Nếu chưa verify tài khoản thì hiển thị loading */
  if (!verified) return <PageLoadingSpinner caption='Verifying your account...' />

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
