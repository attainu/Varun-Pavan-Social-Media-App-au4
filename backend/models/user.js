const mongoose = require('mongoose');

const User = mongoose.model('users', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    profilePic: {
        type: String,
        default: ""
    },
    coverPic: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        min: [999999999, 'Please provide a valid Mobile Number'],
        max: [10000000000]
    },
    password: {
        type: String,
        required: true
    },
    securityQuestion: {
        type: String,
    },
    securityAnswer: {
        type: String,
    },
    location: {
        type: String,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        default: []
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        default: []
    },
    posts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
        default: []
    },
    likedPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
        default: []
    },
    commentedPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
        default: []
    }
})
module.exports = User;

// Custom Validations: express-validator
// Following requeest collection