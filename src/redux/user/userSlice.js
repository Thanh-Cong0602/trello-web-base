import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async data => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  return response.data
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async data => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      let user = action.payload
      state.currentUser = user
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      let user = action.payload
      state.currentUser = user
    })
  }
})

// export const {} = userSlice.actions

export const selectCurrentUser = state => state.user.currentUser

export const userReducer = userSlice.reducer
