import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import { CssBaseline } from '@material-ui/core'
import AppBar from './components/AppBar'
import Drawer from './components/Drawer'
import { AppProvider } from './hooks/useApp'

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AppProvider>
          <AppBar />
          <Drawer />
          <Routes />
        </AppProvider>
      </BrowserRouter>
    </>
  )
}

export default App
