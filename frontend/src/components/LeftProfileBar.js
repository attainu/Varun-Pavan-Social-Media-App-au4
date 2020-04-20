import React, { Component } from "react";
import { connect } from "react-redux";

class LeftProfileBar extends Component {
  render() {
    return (
      <div className="card mx-3 mt-5" style={{ width: "25vw", height: "auto" }}>
        <div className="card-body">
          <h5 className="card-title">Bio</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.app.userId,
  };
};

export default connect(mapStateToProps)(LeftProfileBar);
