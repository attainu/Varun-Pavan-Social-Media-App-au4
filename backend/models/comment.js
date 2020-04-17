const mongoose = require('mongoose');
const Comment = mongoose.model('comments', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comment: {
        type: String
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    commentCreated: {
        type: Date,
        default: new Date()
    }
}
)
module.exports = Comment;