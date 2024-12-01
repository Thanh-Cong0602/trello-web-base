import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { userReducer } from './user/userSlice'

const persistConfig = {
  key: 'root',
  storage,
  whilelist: ['user']
}

const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
