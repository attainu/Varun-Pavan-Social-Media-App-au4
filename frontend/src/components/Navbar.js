import React, { Component } from 'react';
import './Navbar.css'

export default class Navbar extends Component {
  render() {
    return (
      <header>
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">Social Media App</span>
          <form className="form-inline my-2 my-lg-0 mx-auto">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" style={{ width: '450px' }}></input>
            {/* <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
          </form>
          <button className="btn btn-danger mx-5">Log Out</button>
        </nav>
      </header>
    )
  }
}
