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
        <div className="pocketContainer">
          <div className="pocketHeader">
            <div><img className="tableitemimg" src="../../acnlback.png" height="200px"></img></div>
            <h2 className="pocketOwner">{this.props.user.viewer.username}'s pocket</h2>
          </div>
          <div className="pocketBody">
            <ul className="pocketTitle">
              <li>Image</li>
              <li>Name</li>
              <li>Kind</li>
              <li>Bells</li>
              <li>Rarity</li>
              <li>Availibilty</li>
            </ul>
            {this.props.user.pocket.map((data, idx) =>
              <ul key={idx} className="pocketItem">
                <li><img className="tableitemimg" src="../../acnlback.png" height="50px"></img></li>
                <li>{data.name}</li>
                <li>{data.species}</li>
                <li>{data.bells}</li>
                <li>{data.rarity}</li>
                <li>{data.months}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const UserContainer = ReactRedux.connect(
  state => state,
  actions
)(User);

export default UserContainer
