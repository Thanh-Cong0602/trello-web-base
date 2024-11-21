import { Button, Card as MuiCard } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerUserAPI } from '~/apis'
import StarlentoMascot from '~/assets/StarlentoMascot.png'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const navigate = useNavigate()
  const submitLogIn = async data => {
    const { email, password } = data
    toast
      .promise(registerUserAPI({ email, password }), { pending: 'Registration is in progress...' })
      .then(user => {
        navigate(`/login?registeredEmail=${user.email}`)
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url("src/assets/Background.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)'
      }}
    >
      <form onSubmit={handleSubmit(submitLogIn)}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', p: '0.5em 0', borderRadius: 2 }}>
            <Box sx={{ width: '70px', bgcolor: 'white', margin: '0 auto' }}>
              <img src={StarlentoMascot} alt='trungquandev' width='100%' />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: theme => theme.palette.grey[500]
              }}
            >
              <Box>
                <Typography>Author: Thanh Cong Nguyen</Typography>
              </Box>
            </Box>
            <Box sx={{ padding: '0 1em 1em 1em' }}>
              <Box sx={{ marginTop: '1.2em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label='Enter Email...'
                  type='text'
                  variant='outlined'
                  error={!!errors.email}
                  {...register('email', { required: 'This field is required.' })}
                />
                {errors.email && (
                  <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.email.message}
                  </Alert>
                )}
              </Box>

              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label='Enter Password...'
                  type='password'
                  variant='outlined'
                  error={!!errors.password}
                  {...register('password', { required: 'This field is required.' })}
                />
                {errors.password && (
                  <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.password.message}
                  </Alert>
                )}
              </Box>

              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label='Enter Confirm Password...'
                  type='password'
                  variant='outlined'
                  error={!!errors.confirmPassword}
                  {...register('confirmPassword', {
                    validate: value => {
                      if (value === watch('password')) return true
                      else return 'Confirm password does not match!!!'
                    }
                  })}
                />
                {errors.confirmPassword && (
                  <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                    {errors.confirmPassword.message}
                  </Alert>
                )}
              </Box>
            </Box>
            <CardActions sx={{ padding: '0.5em 1em 1em 1em' }}>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
              >
                Login
              </Button>
            </CardActions>
            <Typography sx={{ textAlign: 'center', padding: '0 1em 1em 1em' }}>
              Already have an account?{' '}
              <Link to='/login' style={{ textDecoration: 'none', fontWeight: 600 }}>
                Login
              </Link>
            </Typography>
          </MuiCard>
        </Zoom>
      </form>
    </Box>
  )
}

export default RegisterForm
