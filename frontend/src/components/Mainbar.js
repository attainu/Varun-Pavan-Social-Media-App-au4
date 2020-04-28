import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import moment from 'moment'
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { FaImage } from "react-icons/fa";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import "./Mainbar.css";

const url = 'https://api.cloudinary.com/v1_1/dyhtwa8fn/image/upload';
const preset = 'pv9m8ygk';

class Mainbar extends Component {
  state = {
    posts: [],
    likedPosts: [],
    postsByUser: [],
    postComment: "",
    editComment: "",
    editCommentId: '',
    // userId: "5e88f56e7eba1e1c792efb5a",
    opened: "",
    userId: this.props.userId,
    title: "",
    modalData: [],
    showUsersModal: false,
    postText: "",
    postImage: "",
    imagePreviewUrl: ""
  };

  getPosts = () => {
    let posts = axios.get(
      `/posts/sortedPosts/${this.state.userId}`, {
      headers: { 'auth-token': localStorage.getItem('token') }
    }
    );
    posts.then((res) => {
      console.log(res.data.data);
      // res.data.data.sort((posts1, posts2) => { console.log(posts1.dateCreated > posts2.dateCreated, posts1.dateCreated, posts2.dateCreated); return posts1.dateCreated > posts2.dateCreated ? 1 : -1 });
      this.setState({
        posts: res.data.data,
      });
    });
  };

  getUser = () => {
    let user = axios.get(`/users/${this.state.userId}`, {
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
    let like = await axios.put("/posts/like", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    if (like && this.props.updatePosts)
      this.props.updatePosts();
    this.getUser();
    this.getPosts();
  };

  unlikeHandler = async (id) => {
    let data = {
      postId: id,
      userId: this.state.userId,
    };
    let like = await axios.put("/posts/unlike", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    if (like && this.props.updatePosts)
      this.props.updatePosts();
    this.getUser();
    this.getPosts();
  };
  commentOpenHandler = (opened) => {
    this.setState({ opened });
  };

  editHandler = async () => {
    let data = {
      userId: this.state.userId,
      commentId: this.state.editCommentId,
      postComment: this.state.editComment,
    };
    await axios.put("/comments", data, {
      headers: { 'auth-token': localStorage.getItem('token') }
    });
    this.getPosts();
    this.setState({ editComment: "", editCommentId: "" });
  };

  commentHandler = async (id, idx) => {
    let data = {
      userId: this.state.userId,
      postId: id,
      postComment: this.state.postComment,
    };
    await axios.post("/comments", data, {
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
    await axios.delete("/comments", {
      headers: { 'auth-token': localStorage.getItem('token') }
      , data
    });
    this.getPosts();
    let user = axios.get(
      "/users/" + this.state.userId, {
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

  uploadPost = async () => {
    try {
      let res;
      let imageUrl = "";
      if (this.state.postImage) {
        const formData = new FormData();
        formData.append('file', this.state.postImage);
        formData.append('upload_preset', preset);
        res = await axios.post(url, formData);
        imageUrl = res.data.secure_url;
        console.log(imageUrl);
      }
      let post = await axios.post(`/posts/${this.props.userId}`, {
        type: "text",
        userId: this.props.userId,
        data: this.state.postText,
        image: imageUrl ? imageUrl : ""
      }, {
        headers: { 'auth-token': localStorage.getItem('token') }
      })
      this.getPosts();
      this.setState({
        postText: "",
        postImage: ""
      })
    } catch (error) {

    }
  }

  handlePostTextData = (value) => {
    this.setState({
      postText: value
    });
  }

  chooseFile(type) {
    this.inputElement.click();
  }

  onSelectFile = e => {
    this.setState({
      postImage: e.target.files[0]
    });
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }
    reader.readAsDataURL(e.target.files[0])
  }

  deletePost = (id) => {
    try {
      console.log(id);
      let del = axios.delete(`/posts/`, {
        data: {
          _id: id,
          userId: this.props.userId
        }
      });
      del.then(res => this.getPosts())
    } catch (error) {

    }
  }

  render() {
    console.log(this.props);
    let commentAuth = this.state.postComment.trim().length < 1;
    let editCommentAuth = this.state.editComment.trim().length < 1;
    console.log(this.props);
    let posts, viewUser = this.props.match.params.id === this.props.userId || this.props.match.path === '/home';
    if (this.props.posts) posts = this.props.posts;
    else posts = this.state.posts;
    return (
      <div
        className="pt-5 px-2 px-md-0 mx-md-auto mx-lg-auto posts"
        style={{ width: "60vw", overflowY: "scroll", height: "95vh" }}
      >
        {viewUser && (
          <div className="form-group">
            <div style={{ border: "1px solid" }}>
              <label
                className="p-2 px-3 mb-0"
                style={{
                  width: "100%",
                  backgroundColor: "#dedcdc",
                  borderBottom: "1px solid"
                }}
              >
                Create Post
          </label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="4"
                value={this.state.postText}
                style={{ border: "0" }}
                onChange={(event) => this.handlePostTextData(event.target.value)}
                placeholder="Write Something Here"
              />
              {this.state.postImage && (
                <div className="container">
                  <img src={this.state.imagePreviewUrl} className="img-fluid" alt="Uploaded Image" />
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
              className="mt-1"
            >
              <FaImage size={40}
                className="mx-2"
                onClick={() => this.chooseFile()}
              />
              <button
                onClick={() => this.uploadPost()}
                disabled={this.state.postText.length === 0 && this.state.postImage.length === 0}
                className="btn btn-primary">Post</button>
            </div>
            <input
              className="d-none"
              ref={(input) => (this.inputElement = input)}
              type="file"
              accept="image/*"
              onChange={this.onSelectFile}
            />
          </div>
        )}
        {!posts.length ?
          <h5 className="text-center font-weight-bold text-secondary"> "Create post or follow a friend..!" </h5 > :
          posts.map((data, idx) => {
            return (
              <div key={idx}
                className="mb-3"
                style={{ border: "1px solid" }}>
                <div
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid"
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <img
                      className="rounded-circle m-2"
                      src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
                      style={{
                        width: "3rem",
                      }}
                      alt="Profile"
                    ></img>
                    <div className="pl-2" style={{ alignSelf: "center" }}>
                      <h6 className="mb-0"><Link to={`/${data.userId._id}`}>{data.userId.name}</Link></h6>
                      <p className="mb-0" style={{ fontSize: "0.8rem" }}>
                        {moment
                          .utc(data.dateCreated)
                          .local()
                          .format("DD MMMM YYYY HH:mm")}
                      </p>
                    </div>
                  </div>
                  {data.userId._id === this.props.userId && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EditIcon className="mx-2" data-target="#uploadModal" />
                      <DeleteIcon
                        className="mx-2"
                        onClick={() => this.deletePost(data._id)}
                      />
                    </div>
                  )}
                </div>
                {data.data.length <= 180 ? <h4 className="p-2">{data.data}</h4> : <h6 className="p-1 pl-2">{data.data}</h6>}
                {data.image && <img src={data.image} />}
                <p className=""
                  style={{
                    display: "flex",
                    borderBottom: "1px solid",
                    borderTop: "1px solid"
                  }}>
                  {!this.state.likedPosts.includes(data._id) ? (
                    <span className="mx-auto py-1">
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
                      <span className="mx-auto py-1">
                        <Favorite
                          className="mr-1"
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

                  <span className="mx-auto py-1">
                    <ChatBubbleOutlineIcon
                      className="mr-1"
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
                        comment.userId && <div key={cidx} className="m-1">
                          {/* <div style={{ border: "1px #dee2e6 solid" }}>
                            <div
                              className="border-bottom"
                              style={{
                                display: "flex",
                                alignContent: "center",
                              }}
                            >
                              <img
                                className="rounded-circle m-2"
                                src={`${comment.userId.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}`}
                                style={{ width: "3rem" }}
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
                                  onClick={() => {
                                    this.setState({
                                      editComment: comment.comment,
                                      editCommentId: comment._id
                                    })
                                  }
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
                          </div>*/}
                          <div style={{
                            display: "flex",
                            alignItems: "flex-start"
                          }}
                          >
                            <div>
                              <img
                                className="rounded-circle m-2"
                                src={`${comment.userId.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}`}
                                style={{ width: "3rem" }}
                                alt="Profile"
                              ></img>
                            </div>
                            <div
                              style={{ alignSelf: "center" }}
                              className="mr-auto"
                            >
                              <p
                                className="mb-0 p-1"
                                style={{
                                  background: "#d6d1d1",
                                  borderRadius: "8px"
                                }}
                              >
                                <span className="mr-1">
                                  <Link
                                    to={`/${comment.userId._id}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {comment.userId.name}
                                  </Link>
                                </span>
                                {comment.comment}
                              </p>
                            </div>
                            <div style={{ alignSelf: "center" }}>
                              {comment.userId._id === this.state.userId && (
                                <button
                                  title="Edit"
                                  className="btn p-1"
                                  data-toggle="modal"
                                  data-target="#exampleModalCenter"
                                  onClick={() => {
                                    this.setState({
                                      editComment: comment.comment,
                                      editCommentId: comment._id
                                    })
                                  }
                                  }
                                >
                                  <EditIcon />
                                </button>
                              )}
                              {(comment.userId._id === this.state.userId ||
                                this.state.postsByUser.includes(data._id)) && (
                                  <button
                                    title="Delete"
                                    className="btn p-1"
                                    onClick={() =>
                                      this.deleteHandler(comment._id, data._id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </button>
                                )}
                            </div>
                          </div>
                          <div
                            className="modal fade"
                            data-backdrop="false"
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
                                <div className="modal-header mt-5">
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
                                        this.setState({ editComment: "", editCommentId: "" })
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
                                      this.setState({ editComment: "", editCommentId: "" })
                                    }
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={editCommentAuth}
                                    onClick={() => {
                                      this.editHandler()
                                    }
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
                            data-backdrop="false"
                            id="exampleModalLong"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="exampleModalLongTitle"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header mt-5">
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

                                          (likes, idx) => {
                                            return (<tr key={idx}>
                                              <td>
                                                <Link to={`/${likes._id}`}>
                                                  <img className="rounded-circle m-2" src={`${likes.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}`} style={{ width: "2rem" }} alt="Profile"></img>
                                                </Link>
                                              </td>
                                              <td onClick={() => {
                                                this.profilePage(likes);
                                              }}>
                                                <Link data-dismiss="modal" aria-label="Close" to={`/${likes._id}`}>
                                                  {likes.name}
                                                </Link>
                                              </td>

                                            </tr>);
                                          }
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
                    onChange={(e) => {
                      this.setState({ postComment: e.target.value })
                    }}
                    onKeyDown={(e) => {
                      console.log(e.keyCode)
                      if (e.keyCode === 13)
                        this.commentHandler(data._id, idx)
                    }}
                    placeholder="Write a comment..."
                  />
                  {/* <button
                    className="btn btn-outline-success"
                    disabled={commentAuth}
                    onClick={() => this.commentHandler(data._id, idx)}
                  >
                    Comment
                  </button> */}

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
