import React, { Component } from 'react';
import { connect } from "react-redux";
import LeftBar from './LeftBar';
import './Home.css'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './explore.css'

class Explore extends Component {
    state = {
        allUser: [],
        allFollowing: []
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
    componentDidMount = async () => {
        this.getAllUsers()
        this.getAllFollowing()
    }

    followHandler = async (id) => {
        await axios.post(`http://localhost:3010/users/follow/${localStorage.getItem('userId')}/${id}`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        })
        this.getAllUsers()
        this.getAllFollowing()
    }
    unfollowHandler = async (id) => {
        await axios.put(`http://localhost:3010/users/unfollow/${localStorage.getItem('userId')}/${id}`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        })
        this.getAllUsers()
        this.getAllFollowing()
    }

    render() {
        if (!localStorage.getItem('token')) {
            return <Redirect to='/login' />
        }

        return (
            <div className="layout">
                <LeftBar />
                <div className="container explore" style={{ maxWidth: "100%", overflowY: "scroll", height: "95vh" }}>
                    {this.state.allUser.length > 0 && this.state.allUser.map((user, idx) => {

                        return (
                            (user._id !== localStorage.getItem('userId')) && <div className="card" style={{ width: "18rem" }}>
                                <Link to={`/${user._id}`} style={{ textDecoration: 'none', color: "black" }}>   <img className="card-img-top" src={user.profilePic || "http://getdrawings.com/img/facebook-profile-picture-silhouette-female-3.jpg"} alt="Card image cap" /></Link>
                                <div className="card-body">
                                    <p className="card-text text-weight-bold"><Link to={`/${user._id}`} style={{ textDecoration: 'none', color: "black" }}><h5>{user.name}</h5></Link></p>
                                    <p><h6>{user.email}</h6></p>
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
