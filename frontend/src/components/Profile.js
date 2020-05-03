import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import ImageCropper from './imageCropper';
import "./Profile.css";
import Mainbar from "./Mainbar";
import LeftProfileBar from "./LeftProfileBar";
import { Redirect } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment'

class Profile extends Component {
  state = {
    userData: {},
    user: [],
    tempUser: [],
    active: "following",
    imageCropper: false,
    imageType: '',
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 16 / 9,
    },
  };

  getUser = () => {
    axios
      .get(`/users/user?id=${this.props.match.params.id}`, {
        headers: { 'auth-token': localStorage.getItem('token') }
      })
      .then((res) => {
        console.log(res, "data");
        this.setState({
          userData: res.data.data.user,
        });
      });
  }
  getAboutData = async () => {
    let user = await axios.get(`/users/${this.props.match.params.id}`, {
      headers: { 'auth-token': localStorage.getItem('token') }
    })
    console.log("cwm", user.data.data)
    this.setState({ user: user.data.data, tempUser: user.data.data })
  }
  componentDidMount() {
    this.getUser();
    this.getAboutData()
    console.log(this.state.user)
  }
  updateUser = async () => {
    let data = await axios.post(`/users/update`, this.state.user, {
      headers: { 'auth-token': localStorage.getItem('token') }
    })
    console.log(data)
    this.getUser();
    this.getAboutData()
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      if (prevState.userData === this.state.userData) {
        axios
          .get("/users/user", {
            params: {
              id: this.props.match.params.id,
            },
          }, {
            headers: { 'auth-token': localStorage.getItem('token') }
          })
          .then((res) => {
            this.setState({
              userData: res.data.data.user,
            });
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  chooseFile(type) {
    this.inputElement.click();
    this.setState({
      imageType: type
    })
  }

  changeActive(type) {
    this.props.dispatch({
      type: "changeActive",
      payload: type,
    });
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({
          src: reader.result,
          imageCropper: true
        })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  setImageCropper = () => {
    this.setState({
      imageCropper: false
    });
    console.log("update");
    this.getUser();
  }

  getUpdatePosts = () => {
    axios
      .get(`/users/user?id=${this.props.match.params.id}`, {
        headers: { 'auth-token': localStorage.getItem('token') }
      })
      .then((res) => {
        this.setState({
          userData: res.data.data.user,
        });
      });
  }

  render() {
    if (!localStorage.getItem('token')) {
      return <Redirect to='/login' />
    }
    let colorBlue = {
      color: "orange",
      backgroundColor: "black",
    };
    // console.log(this.state);
    let id = this.props.match.params.id;
    let posts = this.state.userData.posts;
    return (
      <>
        {this.state.imageCropper && <ImageCropper image={this.state.src} showImage={this.setImageCropper} type={this.state.imageType} />}
        <div id="profile-upper">

          <div id="profile-banner-image">
            <img
              src={this.state.userData.coverPic ? this.state.userData.coverPic : "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg"}
              alt="Banner"
            ></img>
          </div>

          <div id="profile-d">
            <div id="profile-pic">
              <img
                src={this.state.userData.profilePic ? this.state.userData.profilePic : "https://terrigen-cdn-dev.marvel.com/content/prod/1x/002irm_ons_mas_mob_01_0.jpg"}
                alt="profile"
              ></img>
              {id === this.props.userId && (
                <div
                  onClick={() => this.chooseFile('dp')}
                  style={{
                    position: "absolute",
                    left: "0px",
                    top: "178px",
                    width: "180px",
                    height: "30px",
                    backgroundColor: "lightgray",
                    opacity: "0.7",
                    display: "flex",
                    alignItems: "center"
                  }}>
                  <button
                    style={{ backgroundColor: 'transparent', paddingLeft: "42%" }}
                  >
                    <CameraAltIcon />
                  </button>
                </div>
              )}
            </div>
            <div id="u-name">{this.state.userData.name}</div>

            {id === this.props.userId && (
              <div id="edit-profile">
                <input
                  className="d-none"
                  ref={(input) => (this.inputElement = input)}
                  type="file"
                  accept="image/*"
                  onChange={this.onSelectFile}
                />
                <button
                  onClick={() => this.chooseFile('cp')}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <CameraAltIcon /> Change Cover Pic
              </button>
              </div>
            )}

          </div>
          <div id="black-grd"></div>
        </div>
        <div
          className="mx-auto border-bottom"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <div>
            <button
              onClick={() => this.changeActive("posts")}
              className=" p-2 px-3 border-right border-left shadow-none"
              style={this.props.active === "posts" ? colorBlue : {}}
            >
              Posts
            </button>
            <button
              onClick={() => this.changeActive("followers")}
              className=" p-2 px-3 border-right"
              style={this.props.active === "followers" ? colorBlue : {}}
            >
              Followers
            </button>
            <button
              onClick={() => this.changeActive("following")}
              className=" p-2 px-3 border-right"
              style={this.props.active === "following" ? colorBlue : {}}
            >
              Following
            </button>
            <button
              onClick={() => {
                this.changeActive("about")
                this.getAboutData()
              }}
              className=" p-2 px-3 border-right"
              style={this.props.active === "about" ? colorBlue : {}}
            >
              About
            </button>
          </div>
        </div>
        {/* <Mainbar /> */}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* <LeftProfileBar /> */}
          <div className="card mx-3 mt-5" style={{ width: "25vw", height: "auto" }}>
            <div className="card-body">
              <h5 className="card-title">Bio</h5>
              <p className="card-text">
                {this.state.user.bio ? this.state.user.bio : '"Write a bio..!"'}
              </p>
              {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
            </div>
          </div>
          {this.props.active === "posts" && <Mainbar posts={posts} updatePosts={this.getUpdatePosts} />}
          {this.props.active === "following" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "Center",
                flexGrow: "3",
              }}
            >
              {this.props.active === "following" &&
                this.state.userData.following &&
                this.state.userData.following.map((data) => (
                  this.props.match.params.id !== data._id && <div
                    className="mx-2 mt-3"
                    style={{ display: "flex", alignItems: "baseline" }}
                  >
                    <img
                      alt="profile"
                      src={data.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}
                      style={{
                        width: "8rem",
                      }}
                    ></img>
                    <Link
                      onClick={() => this.changeActive("posts")}
                      to={`/${data._id}`}
                    >
                      <h3 className="mb-0 ml-2">{data.name}</h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}
          {this.props.active === "followers" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "Center",
                flexGrow: "3",
              }}
            >
              {this.props.active === "followers" &&
                this.state.userData.followers &&
                this.state.userData.followers.map((data) => (
                  this.props.match.params.id !== data._id && <div style={{ display: "flex", alignItems: "baseline" }}>
                    <img
                      alt="Profile"
                      src={data.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}
                      style={{ width: "8rem" }}
                    ></img>
                    <Link
                      onClick={() => this.changeActive("posts")}
                      to={`/${data._id}`}
                    >
                      <h3 className="mb-0 ml-2">{data.name}</h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}
          {this.props.active === "about" && this.state.user && (
            <><table className="table mt-5 about container" style={{ width: "30vw" }}>
              <tbody className="about-ul" >
                <tr >
                  <td className="font-weight-bold">Name </td><td className="text-capitalize"> {this.state.user.name} </td>
                </tr >
                <tr>
                  <td className="font-weight-bold">Email </td><td> {this.state.user.email}</td>
                </tr>
                <tr><td className="font-weight-bold">Phone</td><td> {this.state.user.phone || "00000"}</td></tr>
                <tr><td className="font-weight-bold">Location</td><td className="text-capitalize">{this.state.user.location || "India"}</td></tr>
                <tr><td className="font-weight-bold">DOB </td><td>{moment(this.state.user.dob).format("DD-MM-YYYY") || "01 / 01 / 2000"}</td></tr>
                <tr><td className="font-weight-bold">Gender</td><td className="text-capitalize">{this.state.user.gender || "__"}</td></tr>
              </tbody>
              {this.props.match.params.id === this.props.userId && <EditIcon data-toggle="modal" data-target="#exampleModal" title="Edit profile" />
              }
            </table>
              {/* <!-- Modal --> */}
              <div className="modal fade" data-backdrop="false" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header mt-5">
                      <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({ user: this.state.tempUser })}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <input type="text" className="form-control mb-2" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.name = e.target.value;
                        this.setState({ user })
                      }} value={this.state.user.name} placeholder="Name" />
                      <input type="number" className="form-control mb-2" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.phone = e.target.value;
                        this.setState({ user })
                      }} value={this.state.user.phone} placeholder="Phone" />
                      <input type="text" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.location = e.target.value;
                        this.setState({ user })
                      }} className="form-control mb-2" value={this.state.user.location} placeholder="Location" />
                      <input type="text" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.bio = e.target.value;
                        this.setState({ user })
                      }} className="form-control mb-2" value={this.state.user.bio} placeholder="Bio" />
                      <input type="date" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.dob = e.target.value;
                        this.setState({ user })
                      }} className="form-control mb-2" value={this.state.user.dob} placeholder="Date of birth" />
                      <select className="form-control" placeholder="Gender" onChange={(e) => {
                        let user = { ...this.state.user };
                        user.gender = e.target.value;
                        this.setState({ user })
                      }}>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                                ...
      </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({ user: this.state.tempUser })}>Close</button>
                      <button type="button" className="btn btn-primary" onClick={() => this.updateUser()} data-dismiss="modal">Update</button>
                    </div>
                  </div>
                </div>
              </div></>
          )}

        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.app.userId,
    active: state.app.active,
    userData: state.app.loggedIn,
    viewData: state.app.viewData,
  };
};

export default connect(mapStateToProps)(Profile);
