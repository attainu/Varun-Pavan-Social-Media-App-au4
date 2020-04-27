import React, { Component } from 'react';
import './Navbar.css';
import SearchBar from './searchBar'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { FiLogOut } from 'react-icons/fi';
import ExploreIcon from '@material-ui/icons/Explore';
class Navbar extends Component {
  render() {
    let location = window.location.pathname === '/signup' || window.location.pathname === '/login';
    return (
      <header style={{ borderBottom: "1px solid black" }}>
        <nav className="navbar navbar-expand-sm navbar-dark justify-content-end" style={{ backgroundColor: "#e0e0e0" }}>

          <Link className="navbar-brand mr-auto logo" to="/signup" title="Home" >Social Media</Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon bg-dark"></span>
          </button>
          {localStorage.getItem('token') && !location && <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
            <ul className="navbar-nav text-right">
              <li className="nav-item mr-3">
                <Link className="nav-link " to="/home" title='Home'><HomeRoundedIcon fontSize="large" style={{ color: "black" }} /> </Link>
              </li>
              <li className="nav-item mr-3">
                <Link className="nav-link " to='/explore' title='Explore'>
                  <ExploreIcon fontSize="large" style={{ color: "black" }} />
                </Link>
              </li>
              <li className="nav-item mr-3">
                <Link className="nav-link " to={`/${this.props.userId}`} title='Profile'>
                  <PersonRoundedIcon fontSize="large" style={{ color: "black" }} />
                </Link>
              </li>

              <li className="nav-item mr-3 mt-2 ">
                <SearchBar />
              </li>
              <li className="nav-item mr-3 mt-1 ">
                <Link title='Logout' to="/login" onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('userId')
                  window.location.href = '/login'
                }}><h3><FiLogOut style={{ color: "black" }} /></h3></Link>
              </li>
            </ul>
          </div>}
        </nav>
      </header>
    )
  }
}
let mapsStateToProps = (state) => {
  return {
    userId: state.app.userId,
  }
}
export default connect(mapsStateToProps)(Navbar);