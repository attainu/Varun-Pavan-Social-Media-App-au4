const mongoose = require('mongoose');
const Post = mongoose.model('posts', {
    dataType: {
        type: String,
        enum: ['image', 'text', 'image-text']
    },
    data: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    liked: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        default: []
    },
    comments: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
        default: []
    },
    commented: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
        default: []
    }
});
module.exports = Post;