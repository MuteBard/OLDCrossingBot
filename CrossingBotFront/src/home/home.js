import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from './home.actions';
import { Link } from 'react-router-dom'

class Home extends React.Component{

  packUser1(){
    let data = {
      username: this.props.st_username,
      fname: this.props.st_fname,
      lname: this.props.st_lname,
      pass:this.props.st_password2
    }
    return data;
  }

  packUserTwo(){
    let data = {
      username: this.props.st_username,
      pass: this.props.st_password
    }
    return data;
  }

  render(){
    return(
      <div className="homebackcover">
        <button
          className={this.props.open ? "hide" : "vert btnLOG btn-primary text edit"}
          onClick={() => {this.props.openLog()}}>
          <h1>START</h1>
          <img className="dbimage" src="../../dbicon.ico" height="100px"></img>
        </button>
        {this.props.newUser === false ?
          (this.props.open ? <div className="transparent">
            <h2 className="log">Log In</h2>
            <input className="log2"  placeholder="username" type="text" value={this.props.st_username} onChange={event => this.props.username(event.target.value)}/>
            <input className="log2"  placeholder="password" type="text" value={this.props.st_password} onChange={event => this.props.password(event.target.value)}/>
            <button className="log btnLOG btn-primary" onClick={() => {this.props.signUp()}}>New Account?</button>
            {this.props.passMatch === true ? <Link to={`manager/${this.props.st_username}`} className="log btnLOG btn-primary" onClick={() => {this.props.submit(this.packUser2(),2)}}>Submit</Link> : <button className="log btnLOG btn-primary disabled">Submit</button>}
          </div> : null)
          :
          (this.props.open ? <div className="transparent">
            <h2 className="log">Sign Up</h2>
            <input className="log2" placeholder="username" type="text" value={this.props.st_username} onChange={event => this.props.username(event.target.value)}/>
            <input className="log2" placeholder="first name" type="text" value={this.props.st_fname} onChange={event => this.props.fname(event.target.value)}/>
            <input className="log2" placeholder="last name" type="text" value={this.props.st_lname} onChange={event => this.props.lname(event.target.value)}/>
            <input className="log2" placeholder="password" type="text" value={this.props.st_password} onChange={event => this.props.password(event.target.value)}/>
            <input className="log2" placeholder="password again" type="text" value={this.props.st_password2} onChange={event => this.props.password2(event.target.value)}/>
            <button className="log btnLOG btn-primary" onClick={() => {this.props.logIn()}}>Returning User?</button>
            {this.props.passMatch === true ? <Link to={`manager/${this.props.st_username}`}  className="log btnLOG btn-primary" onClick={() => {this.props.submit(this.packUser1(),1)}}>Submit</Link> : <button className="log btnLOG btn-primary disabled">Submit</button>}
          </div> : null)
        }
      </div>
    )
  }
}

const HomeContainer = ReactRedux.connect(
  state => state.home,
  actions
)(Home);

export default HomeContainer
