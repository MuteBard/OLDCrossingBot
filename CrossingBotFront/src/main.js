import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeContainer from './home/home';
import TableContainer from './table/table';
import ManagerContainer from './manager/manager';
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={HomeContainer}/>
      <Route path='/manager' component={ManagerContainer}/>
      <Route path='/table' component={TableContainer}/>
    </Switch>
  </main>
)

export default Main
