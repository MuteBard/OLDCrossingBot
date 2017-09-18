import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './user.actions';
import { Link } from 'react-router-dom'


class User extends React.Component{

  componentDidMount(){
    let identifier = this.props.match.params.id.slice(1)
    const waitFor = (action) => {
      return new Promise((accept, reject) => {
        setTimeout(() => {
          action
          accept();
        }, 1000);
      });
    };

    waitFor(this.props.getPocket(identifier))
      .then(() => this.props.getStalks())
  };

  render(){
    return(
      <div>
        <div className="nav">
          <div><a><img src="../../login.png" alt="Login" height="50px"/></a></div>
          <div><a  href="https://twitter.com/MidiFreeze"><img src="../../twitter.png" alt="Twitch" height="45px"/></a></div>
          <div><a  href="https://www.twitch.tv/midnightfreeze"><img src="../../twitch.svg" alt="Twitter" height="45px"/></a></div>
          <div><Link to="/"><img src="../../back.png" alt="Backbutton" height="45px"/></Link></div>
        </div>
        <div className="pocketContainer">
          <div className="pocketHeader">
            <div><img className="pocketImg" src={this.props.image} alt={`${this.props.username}`} height="200px"></img></div>
            <h2 className="pocketOwner">{this.props.username}'s pocket</h2>
          </div>
          <div className="pocketBody">
            <ul className="pocketTitle">
              <li>Image</li>
              <li>Caught</li>
              <li>Name</li>
              <li>Kind</li>
              <li>Bells</li>
              <li>Rarity</li>
              <li>Availibilty</li>
            </ul>
            {this.props.pocket.map((data, idx) =>
              <ul key={idx} className="pocketItem">
                <li className="elemImage"><img className="tableitemimg" src={`../../${data.species}/${data.eimage}`} alt="criiter" height="70px"></img></li>
                <li>{data.name}</li>
                <li className="elemOccur">{data.occur}x</li>
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
