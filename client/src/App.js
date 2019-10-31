import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import Navbar from './Components/Navbar'
import Dashboard from './Components/Dashboard/Dashboard'
import Logout from './Components/Logout'
import UserAccount from './Components/UserAccount'
import Map from './Components/Map'
import DashboardTabs from './Components/Dashboard/DashboardTabs'

const App = () => {
  const LoginContainer = () => (
    <div className='container'>
      <Route exact path='/' render={() => <Redirect to='/login' />} />
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
    </div>
  )
  const DefaultContainer = () => (
    <div>
      <Navbar>
        <div>
          <Route exact path='/' render={() => <Redirect to='/login' />} />
          <PrivateRoute path='/dashboard' component={DashboardTabs} />
          <PrivateRoute path='/logout' component={Logout} />
          <PrivateRoute path='/map' component={Map} />
          <PrivateRoute path='/account' component={UserAccount} />
        </div>
      </Navbar>
    </div>
  )

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('user') ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  )

  return (
    <Router>
      <Switch>
        <Route exact path='/(login)' component={LoginContainer} />
        <Route exact path='/signup' component={LoginContainer} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  )
}

export default App
