import React, { Component } from 'react';
import { connect } from "react-redux";
import './Home.css'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './explore.css'

class Explore extends Component {
    state = {
        allUser: [],
        allFollowing: [],
        data: {},
        dataReceived: false,
    }
    getAllUsers = async () => {
        let allUsers = await axios.get('http://localhost:3010/users', {
            headers: { 'auth-token': localStorage.getItem('token') }
        });
        this.setState({ allUser: allUsers.data.data })
    }
    getAllFollowing = async () => {
        let allFollowing = await axios.get(`http://localhost:3010/users/following/${localStorage.getItem('userId')}`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        });
        allFollowing = allFollowing.data.data.following.map(user => user._id)
        this.setState({ allFollowing })
    }

    getData = () => {
        let data = axios.get(
            "http://localhost:3010/users/" + localStorage.getItem('userId'), {
            headers: { 'auth-token': localStorage.getItem('token') }
        }
        );
        data.then((res) => {
            console.log(res)
            this.setState({
                data: res.data.data,
                dataReceived: true,
            });
        });
    }
    componentDidMount = async () => {
        this.getAllUsers()
        this.getAllFollowing()
        this.getData()
    }

    followHandler = async (id) => {
        await axios.post(`http://localhost:3010/users/follow/${localStorage.getItem('userId')}/${id}`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        })
        this.getAllUsers()
        this.getAllFollowing()
        this.getData()
    }
    unfollowHandler = async (id) => {
        await axios.put(`http://localhost:3010/users/unfollow/${localStorage.getItem('userId')}/${id}`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        })
        this.getAllUsers()
        this.getAllFollowing()
        this.getData()
    }

    render() {
        if (!localStorage.getItem('token')) {
            return <Redirect to='/login' />
        }

        return (
            <div className="layout">
                <>
                    <div
                        className="pt-5 px-md-2 pr-md-0 px-lg-4 text-center border-right d-none d-md-block "
                        style={{ overflowY: "scroll", height: "93vh" }}
                    >
                        {this.state.dataReceived && (
                            <>
                                <img
                                    className="rounded-circle"
                                    src={this.state.data.profilePic.length > 0 ? this.state.data.profilePic : "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"}
                                    style={{ width: "12rem" }}
                                    alt="Profile"
                                ></img>
                                <Link to={`/${this.state.data._id}`}>
                                    <h6 className="mt-2">{this.state.data.name}</h6>
                                </Link>
                                <h6>Followers ({this.state.data.followers.length})</h6>
                                <h6>Following ({this.state.data.following.length})</h6>
                            </>
                        )}
                    </div>
                </>
                <div className="container explore" style={{ maxWidth: "100%", overflowY: "scroll", height: "95vh" }}>
                    {this.state.allUser.length > 0 && this.state.allUser.map((user, idx) => {

                        return (
                            (user._id !== localStorage.getItem('userId')) && <div key={idx} className="card" style={{ width: "15rem" }}>
                                <Link to={`/${user._id}`} style={{ textDecoration: 'none', color: "black" }}>   <img className="card-img-top" src={user.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"} alt="" /></Link>
                                <div className="card-body">
                                    < Link to={`/${user._id}`} className="card-text text-weight-bold" style={{ textDecoration: 'none', color: "black" }}><h5>{user.name}</h5></Link>
                                    <h6>{user.email}</h6>
                                </div>
                                <div>
                                    {
                                        this.state.allFollowing.includes(user._id) ? <button className="btn btn-outline-danger" onClick={() => this.unfollowHandler(user._id)}>Unfollow</button> : <button className="btn btn-outline-primary" onClick={() => this.followHandler(user._id)}>Follow</button>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(Explore);
