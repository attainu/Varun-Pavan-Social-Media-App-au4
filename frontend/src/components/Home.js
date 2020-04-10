import React, { Component } from 'react';
import { connect } from "react-redux";
import LeftBar from './LeftBar';
import Mainbar from './Mainbar';

class Home extends Component {
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
