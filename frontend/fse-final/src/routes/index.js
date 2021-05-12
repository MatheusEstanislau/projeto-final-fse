import {Switch, Route} from 'react-router-dom'

import Home from '../pages/Home'
import AddRoom from '../pages/AddRoom'
import CheckStates from '../pages/CheckStates'

const Routes = () => {
  return(
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/addroom' component={AddRoom}/>
      <Route path='/checkstates' component={CheckStates}/>
    </Switch>
  )
}

export default Routes