import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './table.actions';
import { Link } from 'react-router-dom'


class Table extends React.Component{

  componentDidMount(){
    let identifier = this.props.match.params.id
    const waitFor = (action) => {
      return new Promise((accept, reject) => {
        setTimeout(() => {
          action
          accept(this.packTable());
        }, 5000);
      });
    };

    //pull up information from usertablehub
    waitFor(this.props.getUser(identifier))
    //only create the table if this.props.exist is false / if the table doesnt actually exist
      .then(data => {
        if(!data.exists){
          console.log("CREATE")
          //if it doesnt exist create the table and then wait for data to set in so that it can be extracted afterwards
          return waitFor(this.props.createTable(data.tableid))
                      .then((data) =>{
                            console.log(data.exists)
                            console.log("CREATE THEN RETREIVE")
                        this.props.getData(data.tableid)})
        }else{
          console.log("RETRIVE")
          //otherwise just extract the information
          return this.props.getData(data.tableid);
        }
      })
  }

  packTable(){
    let data = {
      username: this.props.username,
      tableid: this.props.tableid,
      exists: this.props.exists
    }
    return data;
  }

  packEdits(){
    let data = {
      edits : this.props.savedEdits,
      tableid: this.props.tableid,
    }
    return data;
  }

  render(){
    return(
      <div>
        <div className="backcover">
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/manager'>Manger</Link></li>
          </ul>
          <div className="text">{this.props.tableid}</div>
          <div className="buttons">
            {this.props.saveState === true ? <div className="saved">Saved</div> : null}
            {this.props.saveState === true ? <div className="hide">{setTimeout(() => this.props.revertSaveState(), 3000)}</div> : null}
            <button
              className="btnEDIT btn-primary text edit"
              onClick={() => {this.props.edit()}}>
              {this.props.editBText}
            </button>
            {this.props.editMode === true ?
              <button
                className="btnEDIT btn-primary text edit"
                onClick={() => {this.props.save(this.packEdits())}}>Save
              </button>:null
            }
          </div>

          <div className="companies">
            <div className="titleRowContainer">
              <div className="title">Company</div>
              <div className="title">Phone</div>
              <div className="title">Contact</div>
              <div className="title">Worth</div>
            </div>

            {this.props.companies.map((company, idx) =>
              <div key={idx} className={idx === this.props.companies.length-1 ? "lastresult resultsContainer" : "resultsContainer"}>

                  {this.props.editMode === true ? <button className="del btnDEL btn-primary" onClick={() => {this.props.del(idx)}}>X</button> : null}
                  {this.props.editMode === false ? <div className="result">{company.company}</div> : <input className="result"  placeholder={company.company} type="text" value={this.props.companies[idx].company} onChange={event => this.props.updateEdit(event.target.value, "company", idx)}/>}
                  {this.props.editMode === false ? <div className="result">{company.phone}</div> : <input className="result"  placeholder={company.phone} type="text" value={this.props.companies[idx].phone} onChange={event => this.props.updateEdit(event.target.value, "phone", idx)}/>}
                  {this.props.editMode === false ? <div className="result">{company.contact}</div> : <input className="result"  placeholder={company.contact} type="text" value={this.props.companies[idx].contact} onChange={event => this.props.updateEdit(event.target.value, "contact", idx)}/>}
                  {this.props.editMode === false ? <div className="result">{company.worth}</div> : <input className="result"  placeholder={company.worth} type="text" value={this.props.companies [idx].worth} onChange={event => this.props.updateEdit(event.target.value, "worth", idx)}/>}
              </div>
            )}

            {this.props.editMode === true ?
                <button
                  className="plus btnADD btn-primary"
                  onClick={() => {this.props.add()}}>+
                </button>:null
            }
          </div>
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
