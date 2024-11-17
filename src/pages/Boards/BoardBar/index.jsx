import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AvatarUser from '~/assets/Avatar.jpg'

const MENU_STYPES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}
const BoardBar = () => {
  return (
    <Box
      sx={{
        width: '100%',
        px: 2,
        height: theme => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        borderBottom: '1px solid white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip icon={<DashboardIcon />} sx={MENU_STYPES} label='Thanh Cong Nguyen' clickable />
        <Chip icon={<VpnLockIcon />} sx={MENU_STYPES} label='Public/Private Workspace' clickable />
        <Chip icon={<AddToDriveIcon />} sx={MENU_STYPES} label='Add to Google Drive' clickable />
        <Chip icon={<FormatBoldIcon />} sx={MENU_STYPES} label='Automation' clickable />
        <Chip icon={<FilterListIcon />} sx={MENU_STYPES} label='Filter' clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
          <Tooltip title='Thanh Cong Nguyen'>
            <Avatar alt='Thanh Cong Nguyen' src={AvatarUser} sx={{ objectFit: 'cover' }} />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
