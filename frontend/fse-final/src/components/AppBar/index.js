import React from 'react'
import { useApp } from '../../hooks/useApp';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu';

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
  const { setDrawerState, openDrawer}= useApp()
  const classes = useStyles()
  return (
    <MuiAppBar position='static'>
      <Toolbar>
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
          onClick={() => setDrawerState(!openDrawer)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          Trabalho Final FSE
        </Typography>
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar
