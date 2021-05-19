import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import { CssBaseline, makeStyles } from '@material-ui/core'
import AppBar from './components/AppBar'
import { AppProvider } from './hooks/useApp'

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}))

function App() {
  const classes = useStyles()
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AppProvider>
          <AppBar />
          <div className={classes.toolbar} />
          <Routes />
        </AppProvider>
      </BrowserRouter>
    </>
  )
}

export default App
