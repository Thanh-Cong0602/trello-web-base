import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Alert, Box, Button, Popover, TextField, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { inviteUserBoardAPI } from '~/apis'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

const InviteBoardUser = ({ boardId }) => {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = event => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const submitInviteUserToBoard = data => {
    const { inviteeEmail } = data

    inviteUserBoardAPI({ inviteeEmail, boardId }).then(() => {
      setValue('inviteeEmail', '')
      setAnchorPopoverElement(null)
    })
  }
  return (
    <Box>
      <Tooltip title='Invite user to this board!'>
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Invite User To This Board!
            </Typography>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label='Enter email to invite...'
                type='text'
                variant='outlined'
                {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteeEmail']}
              />
              {errors.inviteeEmail && (
                <Alert severity='error' sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                  {errors.inviteeEmail.message}
                </Alert>
              )}
            </Box>

            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button className='interceptor-loading' type='submit' variant='contained' color='info'>
                Invite
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser