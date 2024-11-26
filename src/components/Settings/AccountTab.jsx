import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const AccountTab = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }
  const {
    register,
    handleSubmit,
    singleFileValidator,
    formState: { errors }
  } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = data => {
    const { displayName } = data
    console.log('🚀 ~ submitChangeGeneralInformation ~ displayName:', displayName)

    if (displayName === currentUser?.displayName) return

    toast.promise(dispatch(updateUserAPI({ displayName })), { pending: 'Updating...' }).then(res => {
      if (!res.error) {
        toast.success('User update successfully!')
      }
    })
  }

  const onUploadAvatar = e => {
    const error = singleFileValidator(e.target?.files[0])
    console.log('🚀 ~ onUploadAvatar ~ e.target?.files[0]:', e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    console.log('🚀 ~ updateAvatar ~ reqData:', reqData)
    reqData.append('avatar', e.target.files[0])

    for (const value of reqData.values()) {
      console.log('🚀 ~ updateAvatar ~ value:', value)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar sx={{ width: 84, height: 84, mb: 1 }} alt='Thanh Cong Nguyen' src={currentUser?.avatar} />
            <Tooltip title='Upload a new image to update your avatar immediately.'>
              <Button component='label' variant='contained' size='small' startIcon={<CloudUploadIcon />}>
                Upload
                <VisuallyHiddenInput type='file' onChange={onUploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant='h6'>{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'gray' }}>@{currentUser?.username}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label='Your Email'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MailIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label='Your Username'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AssignmentIndIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label='Your Display Name'
                type='text'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MailIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('displayName', { required: 'Your Display Name is required' })}
                error={!!errors['displayName']}
              />
              {errors.displayName && (
                <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                  {errors.displayName.message}
                </Alert>
              )}
            </Box>

            <Box>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
