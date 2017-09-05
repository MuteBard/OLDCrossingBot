import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './manager.actions';
import { Link } from 'react-router-dom'


class Manager extends React.Component{

//we need to make sure getUser get the the according user info based on the username identifier and once
//it manages to do that, we need to package some of that information to getTables to extract all of their
//table info. Promises will be used to make sure all information is ready in getUser before getTables
//fuctions

  componentDidMount(){
    let identifier = this.props.match.params.id
    console.log(identifier)
      const waitFor = (action) => {
        return new Promise((accept, reject) => {
          setTimeout(() => {
            action
            accept(this.packUser());
          }, 1000);
        });
      };

    waitFor(this.props.getUser(identifier))
      .then(data => this.props.getTables(data))
  }


  packUser(){
    let data = {
      username: this.props.username,
      id: this.props.id
    }
    return data;
  }
  render(){
    return(
      <div>
        <div className="managerContainer">

          <div className="plusContainer"
              onClick={() => {this.props.addTable(this.packUser())}}>
            <div className="circle">+</div>
          </div>

          {this.props.tables.map((table, idx) =>
            <div key={idx} className="plusContainer">
              <Link to={`/table/${table.tableid}`}>
                <div className="circle"><img className="dbimage" src="../../dbicon.ico" height="100px"/></div>
                <h2 className="DB">{table.tableid}</h2>
              </Link>
            </div>

          )}

      </div>
    </div>
    )
  }
}

const ManagerContainer = ReactRedux.connect(
  state => state.manager,
  actions
)(Manager);

export default ManagerContainer

// <button
//   className="btnEDIT btn-primary text edit"
//   onClick={() => {this.props.TESTMAN()}}>
//   {this.props.testing === null ? <h1>AWAITING RESPONSE MANAGER</h1> : <h1>SUCCESS MANAGER</h1>}
// </button>
