import React, { Component } from 'react';
import { connect } from "react-redux";
import LeftBar from './LeftBar';
import Mainbar from './Mainbar';
import './Home.css'
import { Redirect } from 'react-router-dom'

class Home extends Component {
  render() {
    if (!localStorage.getItem('token')) {
      return <Redirect to='/login' />
    }
    return (
      <div className="layout">
        <LeftBar />
        <Mainbar />
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(Home);
