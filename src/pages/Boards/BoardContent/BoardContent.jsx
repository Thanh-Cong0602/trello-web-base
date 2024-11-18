import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { cloneDeep } from 'loadsh'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mapOrder } from '~/utils/sort'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import ListColumns from './ListColumns/ListColumns'

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
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  /* Điểm va chạm cuối cùng trước đó (xử lý thuật toán xử lý va chạm) */
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = cardId => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      /* Tìm vị trí (index) của cái overCard trong column đích (Nơi activeCard được thả) */
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      let newCardIndex

      /* Logic tính toán cardIndex mới */
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
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

        /* Cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau */
        const rebuild_activeDraggingCardData = { ...activeDraggingCardData, columnId: nextOverColumn._id }

        /* Tiếp theo là thêm cái card đang kéo thả vào overColumn theo vị trí index mới  */
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        /* Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu */
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  /* Trigger khi bắt đầu kéo (drag) 1 phần tử */
  const handleDragStart = event => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    /* Nếu là kéo thả card mới thực hiện hành động set giá trị old column */
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  /* Trigger khi kết thúc hành động kéo (drag) của 1 phần tử => hành động thả (drop)*/
  const handleDragEnd = event => {
    const { active, over } = event

    if (!over) return

    /* Xử lý kéo thả Card  */
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active

      const { id: overCardId } = over

      /* Tìm 2 column theo Card Id */
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        /* Hành động kéo thả card trong một column */

        /* Lấy vị trí cũ (từ oldColumnWhenDraggingCard) */
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        /* Lấy vị trí cũ (từ over) */
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedColumns = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          targetColumn.cards = dndOrderedColumns
          targetColumn.cardOrderIds = dndOrderedColumns.map(card => card._id)

          return nextColumns
        })
      }
    }

    /* Xử lý kéo thả Column */
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      /* Lấy vị trí cũ (từ active) */
      const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
      /* Lấy vị trí cũ (từ over) */
      const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
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

  const collisionDetectionStrategy = useCallback(
    args => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return closestCorners({ ...args })

      /* Tìm các điểm giao nhau, va chạm - intersections với con trỏ */
      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) return

      /* Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây */
      // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

      /* Tìm overId đầu tiên trong pointerIntersections ở trên */
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find(column => column._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(container => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      /* Tự custom nâng cao thuật toán phát hiện va chạm */
      collisionDetection={collisionDetectionStrategy}
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
