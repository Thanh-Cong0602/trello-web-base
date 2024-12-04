import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

const MENU_STYPES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': { color: 'white' },
  '&:hover': { backgroundColor: 'primary.50' }
}
const BoardBar = ({ board }) => {
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
        bgcolor: theme => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip icon={<DashboardIcon />} sx={MENU_STYPES} label={board?.title} clickable />
        </Tooltip>
        <Chip icon={<VpnLockIcon />} sx={MENU_STYPES} label={capitalizeFirstLetter(board?.type)} clickable />
        <Chip icon={<AddToDriveIcon />} sx={MENU_STYPES} label='Add to Google Drive' clickable />
        <Chip icon={<FormatBoldIcon />} sx={MENU_STYPES} label='Automation' clickable />
        <Chip icon={<FilterListIcon />} sx={MENU_STYPES} label='Filter' clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
