import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import mqtt from 'mqtt'


export const AppContextDefaultValues = {
  openDrawer: false,
  devices: [],
  setDrawerState: () => null,
  changePage: () => null,
  addDevice: () => null,
  client: '',
  device: '',
}

export const AppContext = createContext(AppContextDefaultValues)

const AppProvider = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [devices, setDevices] = useState([])
  const history = useHistory()


  const client = mqtt.connect('wss://test.mosquitto.org:8081')
  const device = mqtt.connect('wss://test.mosquitto.org:8081')


  const changePage = (url) => {
    history.push(`/${url}`)
  }

  return (
    <AppContext.Provider
      value={{
        openDrawer: openDrawer,
        setDrawerState: setOpenDrawer,
        changePage,
        devices: devices,
        addDevice: setDevices,
        client: client,
        device: device
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useApp = () => useContext(AppContext)

export { AppProvider, useApp }
