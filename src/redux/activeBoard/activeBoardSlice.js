import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'loadsh'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

const initialState = {
  currentActiveBoard: null
}

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
})

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload

      state.currentActiveBoard = board
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let board = action.payload

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

export const { updateCurrentActiveBoard } = activeBoardSlice.actions

export const selectCurrentActiveBoard = state => state.activeBoard.currentActiveBoard

export const activeBoardReducer = activeBoardSlice.reducer
