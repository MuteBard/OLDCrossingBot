import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './user.actions';
import { Link } from 'react-router-dom'


class User extends React.Component{

  componentDidMount(){
    let identifier = this.props.match.params.id.slice(1)
    this.props.setUser(identifier,this.props.table.users)
    console.log(identifier)
    this.props.getPocket(identifier)
  };

  render(){
    return(
      <div>
        <h1>TEST USER</h1>
      </div>
    )
  }
}

const UserContainer = ReactRedux.connect(
  state => state,
  actions
)(User);

export default UserContainer
