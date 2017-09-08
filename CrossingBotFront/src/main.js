import React from 'react'
import { Switch, Route } from 'react-router-dom'
import TableContainer from './table/table';
const Main = () => (
  <main>
    <Switch>
      <Route path='/' component={TableContainer}/>
    </Switch>
  </main>
)

export default Main
