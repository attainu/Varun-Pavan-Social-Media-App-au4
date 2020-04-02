const mongoose = require('mongoose');
const Post = mongoose.model('posts', {
    userId: {
        type: String
    },
    data: {
        type: String
    },
    liked: {
        type: Array
    },
    commented: {
        type: Array
    }
})
module.exports = Post;