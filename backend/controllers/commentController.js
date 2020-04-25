const Comment = require('./../models/comment');
const Post = require('./../models/post');
const catchAsync = require('./../utils/catchAsync');

exports.createComment = catchAsync(async (req, res, next) => {
    let { userId, postId, postComment } = req.body;
    let post = await Post.findOne({ _id: postId });
    let comment = await Comment.create({ userId, comment: postComment, postId });
    post.commentsId.push(comment._id);
    let postSaved = await post.save();
    res.status(201).json({
        status: true,
        msg: "comment posted",
        data: {
            comment: comment,
            post: postSaved
        }
    });

});

exports.updateComment = catchAsync(async (req, res, next) => {
    let { userId, commentId, postComment } = req.body;
    let comment = await Comment.update({ _id: commentId, userId }, { $set: { comment: postComment } });
    res.status(201).json({
        status: true,
        msg: "comment updated",
        data: {
            data: comment
        }
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    let { userId, commentId, postId } = req.body;
    let comment = await Comment.findOne({ _id: commentId });
    let post = await Post.findOne({ _id: postId });
    if (post.userId == userId || comment.userId == userId) {
        let deletedComment = await Comment.deleteOne({ _id: commentId })
        post.commentsId.splice(post.commentsId.indexOf(commentId), 1);
        let postSaved = await post.save();
        return res.status(201).json({
            status: true,
            msg: "Comment deleted",
            data: {
                data: comment,
                postSaved,
                deletedComment
            }
        });
    } else {
        return res.status(400).json({
            status: false,
            msg: "Comment deletion failed"
        })
    }
});