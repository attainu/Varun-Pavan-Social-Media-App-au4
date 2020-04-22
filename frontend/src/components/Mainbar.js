import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import moment from 'moment'
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import "./Mainbar.css";

class Mainbar extends Component {
  state = {
    posts: [],
    likedPosts: [],
    postsByUser: [],
    postComment: "",
    editComment: "",
    // userId: "5e88f56e7eba1e1c792efb5a",
    opened: "",
    userId: this.props.userId,
    title: "",
    modalData: [],
    showUsersModal: false,
  };
  getPosts = () => {
    console.log(localStorage.getItem('token'))
    let posts = axios.get(
      `http://localhost:3010/posts/sortedPosts/${this.state.userId}`, {
      headers: { 'auth-token': localStorage.getItem('token') }
    }
    );
    posts.then((res) => {
      // console.log(res.data.data);
      this.setState({
        posts: res.data.data,
      });
    });
  };

  getUser = () => {
    let user = axios.get(`http://localhost:3010/users/${this.state.userId}`, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    user.then((res) => {
      this.setState({
        likedPosts: res.data.data.likedPosts,
        postsByUser: res.data.data.posts,
      });
    });
  };

  componentDidMount() {
    this.getUser();
    this.getPosts();
  }

  likeHandler = async (id) => {
    let data = {
      postId: id,
      userId: this.state.userId,
    };
    await axios.put("http://localhost:3010/posts/like", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    this.getUser();
    this.getPosts();
  };

  unlikeHandler = async (id) => {
    let data = {
      postId: id,
      userId: this.state.userId,
    };
    await axios.put("http://localhost:3010/posts/unlike", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    this.getUser();
    this.getPosts();
  };
  commentOpenHandler = (opened) => {
    this.setState({ opened });
  };

  editHandler = async (commentId) => {
    let data = {
      userId: this.state.userId,
      commentId,
      postComment: this.state.editComment,
    };
    await axios.put("http://localhost:3010/comments", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    this.getPosts();
    this.setState({ editComment: "" });
  };

  commentHandler = async (id, idx) => {
    let data = {
      userId: this.state.userId,
      postId: id,
      postComment: this.state.postComment,
    };
    await axios.post("http://localhost:3010/comments", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    this.setState({ postComment: "" });
    this.getPosts();
    document.getElementById(idx).value = "";
    this.setState({ opened: id });
  };

  deleteHandler = async (commentId, postId) => {
    let data = {
      userId: this.state.userId,
      commentId,
      postId,
    };
    await axios.delete("http://localhost:3010/comments", {
      headers: { 'auth-token': localStorage.getItem('token') }
      , data
    });
    this.getPosts();
    let user = axios.get(
      "http://localhost:3010/users/" + this.state.userId, {
      headers: { 'auth-token': localStorage.getItem('token') }
    }
    );
    user.then((res) => {
      // console.log("user", res.data.data.likedPosts);
      this.setState({ likedPosts: res.data.data.likedPosts });
    });
  };
  likesCommentsModalHandler = (title, modalData) => {
    if (title === "Likes") {
      this.setState({ title, modalData });
    }
    if (title === "Comments") {
      modalData = modalData
        .map((comments) => comments.userId)
        .filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
      this.setState({ title, modalData });
    }
  };

  profilePage = (url) => {
    this.props.history.push(url._id);
  }

  render() {
    let commentAuth = this.state.postComment.trim().length < 1;
    let editCommentAuth = this.state.editComment.trim().length < 1;
    let posts;
    if (this.props.posts) posts = this.props.posts;
    else posts = this.state.posts;
    return (
      <div
        className="pt-5 px-2 px-md-0 mx-md-auto mx-lg-auto posts"
        style={{ width: "60vw", overflowY: "scroll", height: "95vh" }}
      >
        <div className="form-group border">
          <label
            className="p-2 px-3 mb-0"
            style={{ width: "100%", backgroundColor: "#dedcdc" }}
          >
            Create post
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="4"
            placeholder="Write Something Here"
          />
          <button className="btn btn-primary ml-auto mt-2">Post</button>
        </div>
        {posts.length &&
          posts.map((data, idx) => {
            return (
              <div key={idx} className="border mb-3">
                <div
                  className="border-bottom"
                  style={{ display: "flex", alignContent: "center" }}
                >
                  <img
                    className="rounded-circle m-2"
                    src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
                    style={{ width: "4rem" }}
                    alt="Profile"
                  ></img>
                  <div className="pl-2" style={{ alignSelf: "center" }}>
                    <h6 className="mb-0">{data.userId.name}</h6>
                    <p className="mb-0" style={{ fontSize: "0.8rem" }}>
                      {moment
                        .utc(data.dateCreated)
                        .local()
                        .format("DD MMMM YYYY HH:mm")}
                    </p>
                  </div>
                </div>
                <h4 className="p-3">{data.data}</h4>
                <p className="border p-1" style={{ display: "flex" }}>
                  {!this.state.likedPosts.includes(data._id) ? (
                    <span className="mx-auto">
                      <FavoriteBorder
                        className="mr-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => this.likeHandler(data._id)}
                        title="Like"
                      />
                      {data.liked.length > 0 && (
                        <button
                          type="button"
                          style={{ backgroundColor: "white" }}
                          data-toggle="modal"
                          data-target="#exampleModalLong"
                          onClick={() =>
                            this.likesCommentsModalHandler("Likes", data.liked)
                          }
                        >
                          {data.liked.length}
                        </button>
                      )}
                    </span>
                  ) : (
                      <span className="mx-auto">
                        <Favorite
                          className="mr-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => this.unlikeHandler(data._id)}
                          title="Unlike"
                        />
                        {data.liked.length > 0 && (
                          <button
                            style={{ backgroundColor: "white" }}
                            type="button"
                            data-toggle="modal"
                            data-target="#exampleModalLong"
                            onClick={() =>
                              this.likesCommentsModalHandler("Likes", data.liked)
                            }
                          >
                            {data.liked.length}
                          </button>
                        )}
                      </span>
                    )}

                  {/* Comments section */}

                  <span className="mx-auto">
                    <ChatBubbleOutlineIcon
                      className="mr-2"
                      style={{ cursor: "pointer" }}
                      title="Comment"
                      onClick={() => {
                        return this.setState({ opened: data._id });
                      }}
                    />
                    {data.commentsId.length > 0 && (
                      <button
                        type="button"
                        style={{ backgroundColor: "white" }}
                        data-toggle="modal"
                        data-target="#exampleModalLong"
                        onClick={() =>
                          this.likesCommentsModalHandler(
                            "Comments",
                            data.commentsId
                          )
                        }
                      >
                        {data.commentsId.length}
                      </button>
                    )}
                  </span>
                </p>
                <div>
                  {data.commentsId.length > 0 &&
                    data.commentsId.map((comment, cidx) => {
                      // if (data._id === this.state.opened)
                      return (
                        comment.userId && <div key={cidx} className="m-3">
                          <div style={{ border: "1px #dee2e6 solid" }}>
                            <div
                              className="border-bottom"
                              style={{
                                display: "flex",
                                alignContent: "center",
                              }}
                            >
                              <img
                                className="rounded-circle m-2"
                                src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
                                style={{ width: "2rem" }}
                                alt="Profile"
                              ></img>
                              <div
                                className="pl-2"
                                style={{ alignSelf: "center" }}
                              >
                                <h6 className="mb-0">
                                  <Link
                                    to={`/${comment.userId._id}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {comment.userId.name}
                                  </Link>
                                </h6>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {moment(comment.commentCreated).format(
                                    "DD MMMM YYYY HH:mm"
                                  )}
                                </p>
                                <br />
                              </div>
                              <hr />
                              {comment.userId._id === this.state.userId && (
                                <button
                                  title="Edit"
                                  className="btn"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                  onClick={() =>
                                    this.setState({
                                      editComment: comment.comment,
                                    })
                                  }
                                >
                                  <EditIcon />
                                </button>
                              )}
                              {(comment.userId._id === this.state.userId ||
                                this.state.postsByUser.includes(data._id)) && (
                                  <button
                                    title="Delete"
                                    className="btn"
                                    onClick={() =>
                                      this.deleteHandler(comment._id, data._id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </button>
                                )}
                            </div>
                            <div
                              className="container"
                              style={{
                                display: "flex",
                                justifyContent: "start",
                              }}
                            >
                              <p>{comment.comment}</p>
                            </div>
                          </div>
                          <div
                            className="modal fade"
                            id="exampleModalCenter"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="exampleModalCenterTitle"
                            aria-hidden="true"
                          >
                            <div
                              className="modal-dialog modal-dialog-centered"
                              role="document"
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="exampleModalLongTitle"
                                  >
                                    Edit Comment
                                  </h5>

                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.setState({ editComment: "" })
                                      }
                                    >
                                      &times;
                                    </span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <textarea
                                    className="form-control"
                                    rows="2"
                                    value={this.state.editComment}
                                    onChange={(e) =>
                                      this.setState({
                                        editComment: e.target.value,
                                      })
                                    }
                                    placeholder="Edit comment..."
                                  />
                                  ...
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                    onClick={() =>
                                      this.setState({ editComment: "" })
                                    }
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={editCommentAuth}
                                    onClick={() =>
                                      this.editHandler(comment._id)
                                    }
                                    data-dismiss="modal"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Likes/comments modal */}

                          <div
                            className="modal fade"
                            id="exampleModalLong"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="exampleModalLongTitle"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="exampleModalLongTitle"
                                  >
                                    {this.state.title}
                                  </h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span
                                      aria-hidden="true"
                                      onClick={() =>
                                        this.setState({
                                          title: "",
                                          modalData: [],
                                        })
                                      }
                                    >
                                      &times;
                                    </span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  {this.state.modalData.length > 0 && (
                                    <table className="table">
                                      <tbody>
                                        {this.state.modalData.map(
                                          (likes, idx) => (
                                            <tr key={idx}>
                                              <td>
                                                <Link to={`/${likes._id}`}>
                                                  <img
                                                    className="rounded-circle m-2"
                                                    src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
                                                    style={{ width: "2rem" }}
                                                    alt="Profile"
                                                  ></img>
                                                </Link>
                                              </td>
                                              <td onClick={() => {
                                                this.profilePage(likes)
                                              }}>
                                                <Link

                                                  data-dismiss="modal"
                                                  aria-label="Close"
                                                  to={`/${likes._id}`}
                                                >
                                                  {likes.name}
                                                </Link>
                                              </td>
                                              {/* <td><button>Action</button></td> */}
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                                <div className="modal-footer"></div>
                              </div>
                            </div>
                          </div>
                          {/* Ends */}
                        </div>
                      );
                    })}
                  <textarea
                    className="form-control"
                    rows="2"
                    id={idx}
                    onChange={(e) =>
                      this.setState({ postComment: e.target.value })
                    }
                    placeholder="Write a comment..."
                  />
                  <button
                    className="btn btn-outline-success"
                    disabled={commentAuth}
                    onClick={() => this.commentHandler(data._id, idx)}
                  >
                    Comment
                  </button>

                  {/* Comments section ends */}

                  {/* onPointerOver={() => console.log("focused")} */}
                </div>
              </div>
            );
          })
        }
        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
        </button> */}
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.app.userId,
  };
};

export default withRouter(connect(mapStateToProps)(Mainbar));
