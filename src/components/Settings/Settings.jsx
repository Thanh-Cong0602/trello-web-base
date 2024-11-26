import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

const Settings = () => {
  const location = useLocation()

  const getDefaultTabFromURL = () => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY
    return TABS.ACCOUNT
  }
  const [activeTab, setActiveTab] = useState(getDefaultTabFromURL())

  const handleChangeTab = (event, selectedTab) => {
    console.log('🚀 ~ handleChangeTab ~ selectedTab:', selectedTab)
    setActiveTab(selectedTab)
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label='lab API tabs example'>
            <Tab
              label='Account'
              icon={<PersonIcon />}
              iconPosition='start'
              component={Link}
              value={TABS.ACCOUNT}
              to='/settings/account'
            />
            <Tab
              label='Security'
              icon={<SecurityIcon />}
              iconPosition='start'
              component={Link}
              value={TABS.SECURITY}
              to='/settings/security'
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  )
}

export default Settings
