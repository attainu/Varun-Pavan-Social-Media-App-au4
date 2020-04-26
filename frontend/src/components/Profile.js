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

class Profile extends Component {
  state = {
    userData: {},
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
      .get(`http://localhost:3010/users/user?id=${this.props.match.params.id}`, {
        headers: { 'auth-token': localStorage.getItem('token') }
      })
      .then((res) => {
        console.log(res, "data");
        this.setState({
          userData: res.data.data.user,
        });
      });
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      if (prevState.userData === this.state.userData) {
        axios
          .get("http://localhost:3010/users/user", {
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
              onClick={() => this.changeActive("like")}
              className=" p-2 px-3 border-right"
              style={this.props.active === "like" ? colorBlue : {}}
            >
              Liked Posts
            </button>
            <button
              onClick={() => this.changeActive("comment")}
              className=" p-2 px-3 border-right"
              style={this.props.active === "comment" ? colorBlue : {}}
            >
              Commented Posts
            </button>
          </div>
        </div>
        {/* <Mainbar /> */}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <LeftProfileBar />
          {this.props.active === "posts" && <Mainbar posts={posts} />}
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
                  <div
                    className="mx-2 mt-3"
                    style={{ display: "flex", alignItems: "baseline" }}
                  >
                    <img
                      alt="profile"
                      src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
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
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <img
                      alt="Profile"
                      src="http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"
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
