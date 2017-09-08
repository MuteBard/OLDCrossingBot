import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './table.actions';
import { Link } from 'react-router-dom'


class Table extends React.Component{

  componentDidMount(){
    this.props.getData()
  };

  render(){
    return(
      <div className="tablebackground">
        <div className="tablecontainer">
          <h1>CrossingBot Data on MidnightFreeze's room</h1>
          <ul className="tableitem">
            <li>Level</li>
            <li>MuteBard</li>

            <li>Money</li>
            <li>Turnips</li>
          </ul>
          <ul className="tableitem">
            <li>Level</li>
            <li>MidnightFreeze</li>
            <li>Money</li>
            <li>Turnips</li>
          </ul>



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
