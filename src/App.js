import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './screens/login/Login';
import Profile from './screens/profile/Profile';


const App = () => (
  <Switch>
        <Route exact path='/' render={({ history }, props) => <Login {...props} history={history} />} />
        //<Route exact path='/profile' render={({ history }, props) => <Profile {...props} history={history} />} />
  </Switch>
)

export default App;
