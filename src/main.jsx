import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from '~/App.jsx'
import theme from '~/theme'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider
      defaultOptions={{
        allowClose: false,
        dialogProps: { maxWidth: 'xs' },
        confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
        cancellationButtonProps: { color: 'inherit' },
        buttonOrder: ['confirm', 'cancel']
      }}
    >
      <CssBaseline />
      <App />
      <ToastContainer position='bottom-left' theme='colored' />
    </ConfirmProvider>
  </CssVarsProvider>
  // </StrictMode>
)
