import React from 'react'
import { Switch as MuiSwitch } from '@material-ui/core'



const Switch = ({state, onChange}) => {
  return (
    <MuiSwitch
      checked={state}
      onChange={onChange}
      color='primary'
      name='checkedB'
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  )
}

export default Switch