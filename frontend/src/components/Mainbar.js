import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import moment from 'moment'

class Mainbar extends Component {

  state = {
    posts: []
  };

  componentDidMount() {
    let posts = axios.get('http://localhost:3010/posts/sortedPosts/5e88f56e7eba1e1c792efb5a/');
    posts.then(res => {
      console.log(res.data.data);
      this.setState({
        posts: res.data.data
      })
    })
  };

  render() {
    return (
      <div className="pt-5 mx-auto" style={{ width: '60vw', overflowY: 'scroll', height: '95vh' }}>
        <div class="form-group border">
          <label className="p-2 px-3 mb-0" style={{ width: '100%', backgroundColor: "#dedcdc" }}>Create post</label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="4"> Write Something Here</textarea>
          <button className="btn btn-primary ml-auto mt-2">Post</button>
        </div>
        {this.state.posts.length && this.state.posts.map(data => (
          <div className="border mb-3">
            <div className="border-bottom" style={{ display: 'flex', alignContent: 'center' }}>
              <img className="rounded-circle m-2" src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg" style={{ width: "4rem" }} alt="Profile"></img>
              <div className="pl-2" style={{ alignSelf: "center" }}>
                <h6 className="mb-0">{data.userId.name}</h6>
                <p className="mb-0" style={{ fontSize: '0.8rem' }}>{moment.utc(data.dateCreated).local().format('DD MMMM YYYY HH:mm')}</p>
              </div>
            </div>
            <h4 className="p-3">{data.data}</h4>
            <p className='border p-1' style={{ display: 'flex' }}><span className="mx-auto">Like</span> <span className="mx-auto">Comments</span></p>
          </div>
        ))}
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(Mainbar);
