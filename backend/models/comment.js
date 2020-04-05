const mongoose = require('mongoose');
const Comment = mongoose.model('comments', {
    comment: {
        type: String
    }
})
module.exports = Comment;