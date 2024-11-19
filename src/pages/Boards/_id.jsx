import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import { createNewCardAPI, createNewColumnAPI, fetchBoardDetailsAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '673baa23124fb358072bb960'
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  const createNewColumn = async newColumnData => {
    const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })
    console.log('createdColumn', createdColumn)
  }

  const createNewCard = async newCardData => {
    const createdCard = await createNewCardAPI({ ...newCardData, boardId: board._id })
    console.log('createdCard', createdCard)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />
    </Container>
  )
}

export default Board
