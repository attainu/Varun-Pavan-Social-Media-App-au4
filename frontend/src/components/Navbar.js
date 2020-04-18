import React, { Component } from 'react';
import './Navbar.css';
import SearchBar from './searchBar'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Navbar extends Component {
  render() {
    let location = window.location.pathname === '/signup' || window.location.pathname === '/login';
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/signup" title="Home">Social Media</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {!location && <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link mr-3" to="/home">Home </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mr-5" to="/profile">Profile</Link>
              </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <SearchBar />
              <button type="button" className="btn btn-outline-danger ml-5" onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/login'
              }}>Logout</button>
            </div>
          </div>}
          <hr />
        </nav>
      </header>
    )
  }
}
let mapsStateToProps = (state) => {
  return {
    state: state.auth
  }
}
export default connect(mapsStateToProps)(Navbar);