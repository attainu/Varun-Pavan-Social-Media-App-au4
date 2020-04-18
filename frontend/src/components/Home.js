import React, { Component } from 'react';
import { connect } from "react-redux";
import LeftBar from './LeftBar';
import Mainbar from './Mainbar';
import './Home.css'

class Home extends Component {
  render() {
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
