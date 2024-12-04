import DoneIcon from '@mui/icons-material/Done'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { Badge, Box, Button, Chip, Divider, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  addNotification,
  fetchInvitationAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI
} from '~/redux/notifications/notificationSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

const Notifications = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const [newNotification, setNewNotification] = useState(false)

  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => setAnchorEl(null)

  useEffect(() => {
    dispatch(fetchInvitationAPI())

    /* https://socket.io/how-to/use-with-react */
    const onReciewNewInvitation = invitation => {
      if (invitation.inviteeId === currentUser._id) {
        dispatch(addNotification(invitation))
        setNewNotification(true)
      }
    }

    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReciewNewInvitation)

    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReciewNewInvitation)
    }
  }, [currentUser._id, dispatch])

  const notifications = useSelector(selectCurrentNotifications)

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then(res => {
      if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })
  }
  return (
    <Box>
      <Tooltip title='Notifications'>
        <Badge
          color='warning'
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id='basic-button-open-notification'
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <NotificationsNoneIcon sx={{ color: newNotification ? 'yellow' : 'white' }} />
        </Badge>
      </Tooltip>
      <Menu
        sx={{ mt: 2 }}
        id='basic-notification-drop-down'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>
        )}
        {notifications?.map((notification, index) => (
          <Box key={index}>
            <MenuItem sx={{ minWidth: 200, maxWidth: 360, overflowY: 'auto' }}>
              <Box
                sx={{
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize='small' />
                  </Box>
                  <Box>
                    <strong>{notification?.inviter?.displayName}</strong> had invited you to join the board{' '}
                    <strong>{notification.board?.title}</strong>
                  </Box>
                </Box>

                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                    >
                      Accept
                    </Button>

                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='secondary'
                      size='small'
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                    <Chip ico={<DoneIcon />} label='Accepted' color='success' size='small' />
                  )}

                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED && (
                    <Chip ico={<NotInterestedIcon />} label='Rejected' size='small' />
                  )}
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='span' sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>

            {index !== notifications?.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  )
}

export default Notifications
