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
          <h1 className="title">CrossingBot Data on MidnightFreeze's Town<img className="icon2" src={'../../things/tree1.gif'}></img></h1>
          <scan className="searchcontainer">
            <input className="search" placeholder="Enter a viewer's name" type="text" value={this.props.text} onChange={event => this.props.updateSearch(event.target.value)}/>
            <button
              className="btnDEL"
              onClick={() => {this.props.clearText()}}>
              x
            </button>
          </scan>
          {this.props.users.map((person, idx) =>
            <Link className="links" key={idx} to={`/user:${person.id}`}>
              <ul className="tableitem">
                <img className="tableitemimg" src={person.vimage} height="150px"></img>
                <div className="tableitemdata">
                  <li>{person.username}</li>
                  <li>Turnips<img className="icon" src={'../../money/turnip1.gif'}></img><br/>{person.turnips}</li>
                  <li>Bells<img className="icon" src={'../../money/money.gif'}></img><br/>{person.bells}</li>
                  <li>Level<img className="icon" src={'../../things/lvl.gif'}></img><br/>{person.level+1}</li>
                  <li>Bugnet<img className="icon" src={'../../net/net1.gif'}></img><br/>{this.toolRank(person.net)}</li>
                  <li>FishingPole<img className="icon" src={'../../pole/pole1.gif'}></img><br/>{this.toolRank(person.pole)}</li>
                </div>
              </ul>
            </Link>
          )}
          {this.props.users.length === 0 ? <h2 className="nosults"> No Results </h2> : null}
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
