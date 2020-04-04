const mongoose = require('mongoose');
const Post = mongoose.model('posts', {
    dataType: {
        type: String,
        enum: ['image', 'text', 'image-text']
    },
    data: {
        type: String
    },
    liked: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        default: []
    },
    commented: {
        type: Array
    }
})
module.exports = Post;