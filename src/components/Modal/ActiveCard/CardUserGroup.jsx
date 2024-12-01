import AddIcon from '@mui/icons-material/Add'
import { Avatar, Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import AvatarUser from '~/assets/Avatar.jpg'

const CardUserGroup = ({ cardMemberIds = [] }) => {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined

  const handleTogglePopover = event => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {[...Array(8)].map((_, index) => (
        <Tooltip title='Thanh Cong Nguyen' key={index}>
          <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt='Thanh Cong Nguyen' src={AvatarUser} />
        </Tooltip>
      ))}

      {/* Nút này để mở popover thêm member */}
      <Tooltip title='Add new member'>
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: theme => (theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d'),
            bgcolor: theme => (theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200]),
            '&:hover': {
              color: theme => (theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4'),
              bgcolor: theme => (theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff')
            }
          }}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Tooltip>
    </Box>
  )
}

export default CardUserGroup
