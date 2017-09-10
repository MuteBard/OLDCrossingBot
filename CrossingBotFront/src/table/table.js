import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './table.actions';
import { Link } from 'react-router-dom'


class Table extends React.Component{

  componentDidMount(){
    this.props.getData()
  };

  toolRank(number){
    if(number === 5) return "Platinum"
    else if(number === 4) return "Gold"
    else if(number === 3) return "Silver"
    else if(number === 2) return "Regular"
    else return "Wooden"
  }

  render(){
    return(


      <div>

        <div className="nav">

          <div><a><img src="../../login.png" height="50px"/></a></div>
          <div><a  href="https://twitter.com/MidiFreeze"><img src="../../twitter.png" height="45px"/></a></div>
          <div><a  href="https://www.twitch.tv/midnightfreeze"><img src="../../twitch.svg" height="45px"/></a></div>

        </div>

        <div className="tablecontainer">
          <h1 className="title">CrossingBot Data on MidnightFreeze's room</h1>
          <scan className="searchcontainer">
            <input className="search" placeholder="Enter a viewer's name" type="text" value={this.props.text} onChange={event => this.props.updateSearch(event.target.value)}/>
            <button
              className="btnDEL"
              onClick={() => {this.props.clearText()}}>
              x
            </button>
          </scan>

          {this.props.users.map((person, idx) =>
            <ul key={idx} className="tableitem">
              <img className="tableitemimg" src="../../acnlback.png" height="150px"></img>
              <div className="tableitemdata">
                <li>{person.username}</li>

                <li>Turnips<br/>{person.turnips}</li>
                <li>Bells<br/>{person.bells}</li>
                <li>Level<br/>{person.level}</li>
                <li>Bugnet<br/>{this.toolRank(person.net)}</li>
                <li>FishingPole<br/>{this.toolRank(person.pole)}</li>

              </div>
            </ul>
          )}


        </div>
      </div>
    )
  }
}

const TableContainer = ReactRedux.connect(
  state => state.table,
  actions
)(Table);

export default TableContainer
