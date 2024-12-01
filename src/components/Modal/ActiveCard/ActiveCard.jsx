import {
  AttachFileOutlined,
  AutoFixHighOutlined,
  DvrOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonOutlineOutlined,
  SubjectRounded,
  TaskAltOutlined,
  WatchLaterOutlined
} from '@mui/icons-material'
import CancelIcon from '@mui/icons-material/Cancel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { Box, Divider, Modal, Stack, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateCardDetailsAPI } from '~/apis'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import {
  clearCurrentActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { singleFileValidator } from '~/utils/validators'
import CardActivitySection from './CardActivitySection'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardUserGroup from './CardUserGroup'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode == 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode == 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': { backgroundColor: theme.palette.mode == 'dark' ? '#33485D' : theme.palette.grey[300] },
  '&.active': {
    color: theme.palette.mode == 'dark' ? '#000000de' : '#0c66e4',
    backgroundColor: theme.palette.mode == 'dark' ? '#90caf9' : '#e9f2ff'
  }
}))

const ActiveCard = () => {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const handleCloseModal = () => dispatch(clearCurrentActiveCard())

  const callApiUpdateCard = async updateData => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)

    /* Bước 1: Cập nhật lại Card đang active trong modal hiện tại */
    dispatch(updateCurrentActiveCard(updatedCard))
    /* Bước 2: Cập nhật lại cái bản ghi card trong cái activeBoard */

    return updatedCard
  }
  const onUpdateCardTitle = newTitle => callApiUpdateCard({ title: newTitle.trim() })

  const onUploadCardCover = event => {
    console.log('🚀 ~ onUploadCardCover ~ event:', event)
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])
  }
  return (
    <Modal disableScrollLock open={true} onClose={handleCloseModal} sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '9px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: theme => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
        }}
      >
        <Box sx={{ position: 'absolute', top: '12px', right: '10px', cursor: 'pointer' }}>
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt='Card cover'
            />
          </Box>
        )}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Members</Typography>
              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
                <SubjectRounded />
                <Typography variant='span' sx={{ fontWeight: 600, fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlined />
                <Typography variant='span' sx={{ fontWeight: 600, fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>
              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection />
            </Box>
          </Grid>

          {/* Right Side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Add To Card</Typography>

            <Stack direction='column' spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              <SidebarItem className='active'>
                <PersonOutlineOutlined fontSize='small' />
                Join
              </SidebarItem>
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className='active' component='label'>
                <ImageOutlined fontSize='small' />
                Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCover} />
              </SidebarItem>
              <SidebarItem fontSize='small'>
                <AttachFileOutlined />
                Attachment
              </SidebarItem>
              <SidebarItem fontSize='small'>
                <LocalOfferOutlined />
                Labels
              </SidebarItem>

              <SidebarItem fontSize='small'>
                <TaskAltOutlined />
                CheckList
              </SidebarItem>

              <SidebarItem fontSize='small'>
                <WatchLaterOutlined />
                Dates
              </SidebarItem>

              <SidebarItem fontSize='small'>
                <AutoFixHighOutlined />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
