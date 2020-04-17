import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import moment from 'moment'
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


class Mainbar extends Component {

  state = {
    posts: [],
    likedPosts: [],
    postsByUser: [],
    postComment: "",
    editComment: "",
  };
  getPosts = () => {
    let posts = axios.get('http://localhost:3010/posts/sortedPosts/5e931261f6539324ecbe4576/');
    posts.then(res => {
      console.log(res.data.data);
      this.setState({
        posts: res.data.data
      })
    })
  }
  getUser = () => {
    let user = axios.get('http://localhost:3010/users/5e931261f6539324ecbe4576')
    user.then(res => {
      this.setState({ likedPosts: res.data.data.likedPosts, postsByUser: res.data.data.posts })
    });
  }

  componentDidMount() {
    this.getUser()
    this.getPosts()
  };
  likeHandler = async (id) => {
    let data = {
      postId: id,
      userId: "5e931261f6539324ecbe4576"
    }
    await axios.put('http://localhost:3010/posts/like', data);
    this.getUser()
    this.getPosts()
  }
  unlikeHandler = async (id) => {
    let data = {
      postId: id,
      userId: "5e931261f6539324ecbe4576"
    }
    await axios.put('http://localhost:3010/posts/unlike', data);
    this.getUser()
    this.getPosts()
  }

  editHandler = async (commentId) => {
    let data = {
      userId: "5e931261f6539324ecbe4576",
      commentId,
      postComment: this.state.editComment
    }
    let editComment = await axios.put('http://localhost:3010/comments', data)
    console.log(editComment);
    this.getPosts();
    this.setState({ editComment: "" })
  }

  commentHandler = async (id, idx) => {
    let data = {
      userId: "5e931261f6539324ecbe4576",
      postId: id,
      postComment: this.state.postComment
    }
    let comment = await axios.post("http://localhost:3010/comments", data);
    this.setState({ postComment: "" })
    console.log(comment)
    this.getPosts()
    document.getElementById(idx).value = ""
  }

  deleteHandler = async (commentId, postId) => {
    let data = {
      userId: "5e931261f6539324ecbe4576",
      commentId,
      postId
    }
    let deleteComment = await axios.delete("http://localhost:3010/comments", { data });
    console.log(deleteComment);
    this.getPosts()
  }
  render() {
    let commentAuth = this.state.postComment.trim().length < 1
    let editCommentAuth = this.state.editComment.trim().length < 1
    return (
      <div className="pt-5 mx-auto" style={{ width: '60vw', overflowY: 'scroll', height: '95vh' }}>
        <div className="form-group border">
          <label className="p-2 px-3 mb-0" style={{ width: '100%', backgroundColor: "#dedcdc" }}>Create post</label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" placeholder="Write Something Here" />
          <button className="btn btn-primary ml-auto mt-2">Post</button>
        </div>
        {this.state.posts.length && this.state.posts.map((data, idx) => {
          return (
            <div key={idx} className="border mb-3">
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
                  <span className="mx-auto" style={{ cursor: "pointer" }} onClick={() => this.likeHandler(data._id)} title="Like"> <FavoriteBorder /> {data.liked.length === 0 ? null : data.liked.length}</span>
                  : <span className="mx-auto" style={{ cursor: "pointer" }} onClick={() => this.unlikeHandler(data._id)} title="Unlike">< Favorite /> {data.liked.length === 0 ? null : data.liked.length}</span>}


                {/* Comments section */}


                <span className="mx-auto" style={{ cursor: "pointer" }} title="Comment" onClick={() => this.setState({ hide: !this.state.hide })}><ChatBubbleOutlineIcon /> {data.commentsId.length === 0 ? null : data.commentsId.length} </span></p>
              <div>
                {data.commentsId.length > 0 && data.commentsId.map((comment, cidx) =>
                  <div key={cidx} className="m-3">
                    <div style={{ border: "1px #dee2e6 solid" }}>
                      <div className="border-bottom" style={{ display: 'flex', alignContent: 'center' }}>
                        <img className="rounded-circle m-2" src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg" style={{ width: "2rem" }} alt="Profile"></img>
                        <div className="pl-2" style={{ alignSelf: "center" }}>
                          <h6 className="mb-0">{comment.userId.name}</h6>
                          <p className="mb-0" style={{ fontSize: '0.8rem' }}>{moment(comment.commentCreated).format('DD MMMM YYYY HH:mm')}</p><br />
                        </div>
                        <hr />
                        {comment.userId._id === "5e931261f6539324ecbe4576" &&
                          <button title="Edit" className="btn" data-toggle="modal" data-target="#exampleModalCenter" onClick={() => this.setState({ editComment: comment.comment })}>
                            <EditIcon />
                          </button>}
                        {(comment.userId._id === "5e931261f6539324ecbe4576" || this.state.postsByUser.includes(data._id)) &&
                          <button title="Delete" className="btn" onClick={() => this.deleteHandler(comment._id, data._id)}>
                            <DeleteIcon />
                          </button>}
                      </div>
                      <div className="container" style={{ display: "flex", justifyContent: "start" }}>
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                    <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Edit Comment</h5>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true" onClick={() => this.setState({ editComment: "" })}>&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <textarea className="form-control" rows="2" value={this.state.editComment} onChange={(e) => this.setState({ editComment: e.target.value })} placeholder="Edit comment..." />
                ...
      </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({ editComment: "" })}>Close</button>
                            <button type="button" className="btn btn-primary" disabled={editCommentAuth} onClick={() => this.editHandler(comment._id)} data-dismiss="modal">Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
                <textarea className="form-control" rows="2" id={idx} onChange={(e) => this.setState({ postComment: e.target.value })} placeholder="Write a comment..." />
                <button className="btn btn-outline-success" disabled={commentAuth} onClick={() => this.commentHandler(data._id, idx)}>Comment</button>

              </div>
              {/* Comments section ends */}

              {/* onPointerOver={() => console.log("focused")} */}
            </div>
          )
        })}
        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
        </button> */}

      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(Mainbar);
