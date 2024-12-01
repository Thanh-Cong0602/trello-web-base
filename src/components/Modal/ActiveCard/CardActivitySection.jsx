import { Avatar, Box, TextField, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const CardActivitySection = () => {
  const currentUser = useSelector(selectCurrentUser)
  const handleAddCardComment = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!event.target?.value) return

      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim()
      }
      console.log('🚀 ~ handleAddCardComment ~ commentToAdd:', commentToAdd)
    }
  }
  return (
    <Box sx={{ mt: 2 }}>
      {/* Handle add comment to Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
          alt='Thanh Cong Nguyen'
          src={currentUser?.avatar}
        />
        <TextField
          fullWidth
          placeholder='Write a comment...'
          type='text'
          variant='outlined'
          multiline
          onKeyDown={handleAddCardComment}
        />
      </Box>

      {/* Hiển thị danh sách các comments */}
      {[...Array(0)].length === 0 && (
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: 500, color: '#b1b1b1' }}>
          No activity found!
        </Typography>
      )}

      {[...Array(6)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }}>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt='Thanh Cong Nguyen'
              src={currentUser?.avatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant='span' sx={{ fontWeight: 'bold', mr: 1 }}>
              Thanh Cong Nguyen
            </Typography>

            <Typography variant='span' sx={{ fontSize: '12px' }}>
              {moment().format('llll')}
            </Typography>

            <Box
              sx={{
                display: 'block',
                bgcolor: theme => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
                p: '8px 12px',
                mt: '4px',
                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                wordBreak: 'break-word',
                boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)'
              }}
            >
              This is a comment!
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default CardActivitySection
