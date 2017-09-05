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
          <div className="tableitem1">a</div>
          <div className="tableitem2">b</div>
          <div className="tableitem3">c</div>
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
