import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: 10m
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

/*
withCredentials : sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE
phục vụ TH nếu chúng ta sử dụng JWT tokens (refresh & access tokens) theo cơ chế httpOnly Cookie.
*/

authorizedAxiosInstance.defaults.withCredentials = true

// Add a request interceptor: Can thiệp vào những cái request APIs
authorizedAxiosInstance.interceptors.request.use(
  config => {
    // const accessToken = localStorage.getItem('accessToken')
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`
    // }
    /* Kỹ thuật chặn spam click */
    interceptorLoadingElements(true)

    return config
  },
  _error => {
    return Promise.reject(_error)
  }
)

let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use(
  response => {
    /* Kỹ thuật chặn spam click */
    interceptorLoadingElements(false)
    return response
  },
  _error => {
    interceptorLoadingElements(false)
    /* Quan trọng: Xử lý refresh token tự động */
    /* TH1: Nếu như nhận mã 401 từ BE, thì gọi API đăng xuất luôn */
    if (_error.response?.statu === 401) axiosReduxStore.dispatch(logoutUserAPI(false))

    /* TH2: Nếu như nhận mã 410 từ phía BE, thì sẽ gọi API refreshToken để làm mới lại accessToken */
    const originalRequests = _error.config
    if (_error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            return data?.accessToken
          })
          .catch(_error => {
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then(_accessToken => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

    let _errorMessage = _error?.message
    if (_error.response?.data?.message) _errorMessage = _error.response?.data?.message

    if (_error.response?.status !== 410) toast.error(_errorMessage)

    return Promise.reject(_error)
  }
)

export default authorizedAxiosInstance
