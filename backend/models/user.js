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
    phone: {
        type: Number,
        min: [999999999, 'Please provide a valid Mobile Number'],
        max: [10000000000]
    },
    password: {
        type: String,
        required: true
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
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    },
    posts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
    },
    likedPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
    },
    commentedPosts: {
        type: Array
    }
})
module.exports = User;