import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TableContainer from './table/table';
import UserContainer from './user/user';
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={TableContainer}/>
      <Route path='/user:id' component={UserContainer}/>
    </Switch>
  </main>
)

export default Main
