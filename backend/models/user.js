const mongoose = require('mongoose');

const User = mongoose.model('users', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
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
    }
})
module.exports = User;