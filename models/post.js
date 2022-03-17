const mongoose = require('mongoose');
const Post = mongoose.model('posts', new mongoose.Schema({
    dataType: {
        type: String,
    },
    data: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    liked: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        default: []
    },
    commentsId: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
        default: []
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}));
module.exports = Post;