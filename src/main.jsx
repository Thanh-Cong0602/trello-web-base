import { GlobalStyles } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import App from '~/App.jsx'
import { store } from '~/redux/store'
import theme from '~/theme'

const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
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
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
  // </StrictMode>
)
