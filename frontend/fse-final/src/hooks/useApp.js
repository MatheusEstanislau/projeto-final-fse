import { createContext, useContext, useState } from 'react'
import {useHistory} from 'react-router-dom'

export const AppContextDefaultValues = {
  openDrawer: false,
  setDrawerState: () => null,
  changePage: () => null
}

export const AppContext = createContext(
  AppContextDefaultValues
)

const AppProvider = ({children}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory()

  const changePage = (url) => {
    history.push(`/${url}`)
  }

  return (
    <AppContext.Provider
      value={{openDrawer: openDrawer, setDrawerState: setOpenDrawer, changePage}}
    >
      {children}
    </AppContext.Provider>
  )
}

const useApp = () => useContext(AppContext)

export { AppProvider, useApp }