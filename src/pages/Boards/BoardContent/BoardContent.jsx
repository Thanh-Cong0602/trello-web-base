import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sort'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import ListColumns from './ListColumns/ListColumns'
import { cloneDeep } from 'loadsh'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  /* Cùng một thời điểm chỉ có một phần tử được kéo (column hoặc card) */
  // eslint-disable-next-line no-unused-vars
  const [activeDragItemId, setActiveDragItemId] = useState()
  const [activeDragItemType, setActiveDragItemType] = useState()
  const [activeDragItemData, setActiveDragItemData] = useState()

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = cardId => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  /* Trigger khi bắt đầu kéo (drag) 1 phần tử */
  const handleDragStart = event => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
  }

  /* Trigger trong quá trình kéo (drag) 1 phần tử */
  const handleDragOver = event => {
    /* Không làm gì thêm nếu kéo column */
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    /* Còn nếu kéo Card thì xử lý thêm để có thể kéo thả card giữa các column */
    // console.log('handleDragOver', event)
    const { active, over } = event
    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    const { id: overCardId } = over

    /* Tìm 2 column theo Card Id */
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        /* Tìm vị trí (index) của cái overCard trong column đích (Nơi activeCard được thả) */
        const overCardIndex = overColumn?.card?.findIndex(card => card._id === overCardId)
        let newCardIndex

        /* Logic tính toán cardIndex mới */
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        /* nextActiveColumn: Column cũ */
        if (nextActiveColumn) {
          /* Xóa card ở column active */
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          /* Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu */
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        /* nextOverColumn: Column mới */
        if (nextOverColumn) {
          /* Kiểm tra xem card đang kéo có tồn tại ở column chưa, nếu đã tồn tại thì xóa đi */
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          /* Tiếp theo là thêm cái card đang kéo thả vào overColumn theo vị trí index mới  */
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          /* Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu */
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  /* Trigger khi kết thúc hành động kéo (drag) của 1 phần tử => hành động thả (drop)*/
  const handleDragEnd = event => {
    // console.log('handleDragEnd', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log(' Hành động kéo thả Card')
      return
    }
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: theme => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}

          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
