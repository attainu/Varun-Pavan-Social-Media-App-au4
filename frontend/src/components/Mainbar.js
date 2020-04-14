import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import moment from 'moment'
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';


class Mainbar extends Component {

  state = {
    posts: [],
    likedPosts: []
  };

  componentDidMount() {
    let posts = axios.get('http://localhost:3010/posts/sortedPosts/5e931261f6539324ecbe4576/');
    posts.then(res => {
      console.log(res.data.data);
      this.setState({
        posts: res.data.data
      })
    })
    let user = axios.get('http://localhost:3010/users/5e931261f6539324ecbe4576')
    user.then(res => {
      // console.log("user", res.data.data.likedPosts);
      this.setState({ likedPosts: res.data.data.likedPosts })
    });

  };
  likeHandler = async (id) => {
    let data = {
      postId: id,
      userId: "5e931261f6539324ecbe4576"
    }
    let like = await axios.put('http://localhost:3010/posts/like', data);
    // console.log(like)
    let user = axios.get('http://localhost:3010/users/5e931261f6539324ecbe4576')
    user.then(res => {
      // console.log("user", res.data.data.likedPosts);
      this.setState({ likedPosts: res.data.data.likedPosts })
    });
  }
  unlikeHandler = async (id) => {
    let data = {
      postId: id,
      userId: "5e931261f6539324ecbe4576"
    }
    let unlike = await axios.put('http://localhost:3010/posts/unlike', data);
    // console.log(unlike)
    let user = axios.get('http://localhost:3010/users/5e931261f6539324ecbe4576')
    user.then(res => {
      // console.log("user", res.data.data.likedPosts);
      this.setState({ likedPosts: res.data.data.likedPosts })
    });
  }
  render() {
    // console.log(this.state.likedPosts)
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
            <p className='border p-1' style={{ display: 'flex' }}>
              {!this.state.likedPosts.includes(data._id) ?
                <span className="mx-auto" style={{ cursor: "pointer" }} onClick={() => this.likeHandler(data._id)}> <FavoriteBorder /></span>
                : <span className="mx-auto" style={{ cursor: "pointer" }} onClick={() => this.unlikeHandler(data._id)}><Favorite /></span>}

              <span className="mx-auto" style={{ cursor: "pointer" }}><ChatBubbleOutlineIcon /> </span></p>
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
