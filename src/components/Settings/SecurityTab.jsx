import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useConfirm } from 'material-ui-confirm'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updateUserAPI } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const SecurityTab = () => {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const confirmChangePassword = useConfirm()

  const submitChangePassword = data => {
    confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
        </Box>
      ),
      description: 'You have to login after successfully changing your password. Continue ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        const { current_password, new_password } = data

        toast
          .promise(dispatch(updateUserAPI({ current_password, new_password })), { pending: 'Updating...' })
          .then(res => {
            if (!res.error) {
              toast.success('Successfully changed your password, please login again!')
              
            }
          })
      })
      .catch(() => {})
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
        <Box>
          <Typography variant='h5'>Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label='Current Password'
                type='password'
                variant='outlined'
                autoComplete='current_password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PasswordIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                })}
                error={!!errors['current_password']}
              />
              {errors.current_password && (
                <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                  {errors.current_password.message}
                </Alert>
              )}
            </Box>

            <Box>
              <TextField
                fullWidth
                label='New Password'
                type='password'
                variant='outlined'
                autoComplete='new_password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                })}
                error={!!errors['new_password']}
              />
              {errors.new_password && (
                <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                  {errors.new_password.message}
                </Alert>
              )}
            </Box>

            <Box>
              <TextField
                fullWidth
                label='New Password Confirmation'
                type='password'
                variant='outlined'
                autoComplete='new_password_confirmation'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockResetIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: value => {
                    if (value === watch('new_password')) return true
                    return 'Password confirm does not match'
                  }
                })}
                error={!!errors['new_password_confirmation']}
              />
              {errors.new_password_confirmation && (
                <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                  {errors.new_password_confirmation.message}
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
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}
export default SecurityTab
