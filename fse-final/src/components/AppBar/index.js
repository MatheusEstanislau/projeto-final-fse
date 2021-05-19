import React from 'react'
import {
  AppBar as MuiAppBar,
  Toolbar,
  makeStyles,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const AppBar = () => {
  const classes = useStyles()
  return (
    <MuiAppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Final work of FSE
        </Typography>
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar
