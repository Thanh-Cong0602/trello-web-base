import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

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

authorizedAxiosInstance.interceptors.response.use(
  response => {
    /* Kỹ thuật chặn spam click */
    interceptorLoadingElements(false)
    return response
  },
  _error => {
    interceptorLoadingElements(false)

    let _errorMessage = _error?.message
    if (_error.response?.data?.message) _errorMessage = _error.response?.data?.message

    if (_error.response?.status !== 410) toast.error(_errorMessage)

    return Promise.reject(_error)
  }
)
export default authorizedAxiosInstance
