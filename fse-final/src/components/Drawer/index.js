import React from 'react'
import {
  SwipeableDrawer as MuiDrawer,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
} from '@material-ui/core'
import { useApp } from '../../hooks/useApp'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import HomeIcon from '@material-ui/icons/Home';
import ComputerIcon from '@material-ui/icons/Computer';

const Drawer = () => {
  const { openDrawer, setDrawerState, changePage } = useApp()
  return (
    <MuiDrawer
      open={openDrawer}
      onClose={() => setDrawerState(false)}
      onOpen={() => setDrawerState(true)}
      anchor='left'
    >
      <List>
        <ListItem button onClick={() => changePage('')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Home' />
        </ListItem>
        <ListItem button onClick={() => changePage('addroom')}>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary='Adicionar Comodos' />
        </ListItem>
        <ListItem button onClick={() => changePage('checkstates')}>
          <ListItemIcon>
            <ComputerIcon />
          </ListItemIcon>
          <ListItemText primary='Monitorar Estados' />
        </ListItem>  
      </List>
    </MuiDrawer>
  )
}

export default Drawer
