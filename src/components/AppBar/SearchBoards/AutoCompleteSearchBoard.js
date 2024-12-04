import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useEffect, useState } from 'react'
import { createSearchParams } from 'react-router-dom'

const AutoCompleteSearchBoard = () => {
  const [open, setOpen] = useState(false)

  const [boards, setBoards] = useState(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) setBoards(null)
  }, [open])

  const handleInputSearchChange = event => {
    const searchValue = event.target?.value
    if (!searchValue) return
    console.log('🚀 ~ handleInputSearchChange ~ searchValue:', searchValue)

    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`
    console.log('🚀 ~ handleInputSearchChange ~ searchPath:', searchPath)
  }

  const handleSelectedBoard = (event, selectedBoard) => {
    console.log('🚀 ~ handleSelectedBoard ~ selectedBoard:', selectedBoard)
  }
  return (
    <Autocomplete
      sx={{ width: 220 }}
      id='asynchronous-search-board'
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={board => board.title}
      options={boards || []}
      loading={loading}
      onInputChange={handleInputSearchChange}
      onChange={handleSelectedBoard}
      renderInput={params => (
        <TextField
          {...params}
          id='outlined-search'
          label='Search...'
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon fontSize='small' />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
      )}
    ></Autocomplete>
  )
}

export default AutoCompleteSearchBoard
