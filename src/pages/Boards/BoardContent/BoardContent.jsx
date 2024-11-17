import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sort'
import ListColumns from './ListColumns/ListColumns'
import { arrayMove } from '@dnd-kit/sortable'

const BoardContent = ({ board }) => {
  /*
   * https://docs.dndkit.com/api-documentation/sensors
   * Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trong trường hợp click bị gọi event
   */

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  /* Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trong trường hợp click bị gọi event */
  const mouseSenSor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  /* Nhấn giữ 250ms và dung sai của cảm ứng thì mới kích hoạt event */
  const touchSenSor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSenSor, touchSenSor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = event => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      // Lấy vị trí cũ (từ active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy vị trí cũ (từ over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: theme => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
