import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import randomColor from 'randomcolor'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import SidebarCreateBoardModal from './create'
import { Pagination, PaginationItem } from '@mui/material'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300] },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'e9f2ff'
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)

  const location = useLocation()

  const query = new URLSearchParams(location.search)

  const page = parseInt(query.get('page') || '1', 10)

  useEffect(() => {
    setBoards([...Array(16)].map((_, i) => i))
  }, [])

  if (!boards) {
    return <PageLoadingSpinner caption='Loading Boards...' />
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ px: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction='column' spacing={1}>
              <SidebarItem className='active'>
                <SpaceDashboardIcon fontSize='small' />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize='small' />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize='small' />
                Home
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction='column' spacing={1}>
              <SidebarCreateBoardModal />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>

            {boards?.length === 0 && (
              <Typography variant='span' sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            <Grid container spacing={2}>
              {boards?.map(b => (
                <Grid xs={2} sm={3} md={4} key={b}>
                  <Card sx={{ width: '250px' }}>
                    <Box sx={{ height: '50px', backgroundColor: randomColor() }}></Box>

                    <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                      <Typography gutterBottom variant='h6' component='div'>
                        Board title
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                      >
                        This impressive pealla is a perfect...
                      </Typography>
                      <Box
                        component={Link}
                        to={'/boards/673baa23124fb358072bb960'}
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          color: 'primary.main',
                          '&:hover': { color: 'primary.light' }
                        }}
                      >
                        Go to board <ArrowRightIcon fontSize='small' />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Pagination
                size='large'
                color='secondary'
                showFirstButton
                showLastButton
                count={boards.length}
                page={page}
                renderItem={item => (
                  <PaginationItem
                    component={Link}
                    to={`/boards${item.page === 1 ? '' : `?page=${item.page}`}`}
                    {...item}
                  />
                )}
              ></Pagination>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
