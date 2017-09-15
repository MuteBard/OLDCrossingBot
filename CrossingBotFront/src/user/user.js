import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './user.actions';
import { Link } from 'react-router-dom'


class User extends React.Component{

  componentDidMount(){
    let identifier = this.props.match.params.id.slice(1)
    console.log(identifier)
    this.props.getPocket(identifier)
  };

  render(){
    return(
      <div>
        <div className="nav">
          <div><a><img src="../../login.png" height="50px"/></a></div>
          <div><a  href="https://twitter.com/MidiFreeze"><img src="../../twitter.png" height="45px"/></a></div>
          <div><a  href="https://www.twitch.tv/midnightfreeze"><img src="../../twitch.svg" height="45px"/></a></div>
          <div><Link to="/"><img src="../../back.png" height="45px"/></Link></div>
        </div>
        <div className="pocketContainer">
          <div className="pocketHeader">
            <div><img className="pocketImg" src={this.props.image} height="200px"></img></div>
            <h2 className="pocketOwner">{this.props.username}'s pocket</h2>
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
            {this.props.pocket.map((data, idx) =>
              <ul key={idx} className="pocketItem">
                <li><img className="tableitemimg" src={`../../${data.species}/${data.eimage}`} height="70px"></img></li>
                <li>{data.name}</li>
                <li>{data.species}</li>
                <li>{data.ebells}</li>
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
  state => state.user,
  actions
)(User);

export default UserContainer
