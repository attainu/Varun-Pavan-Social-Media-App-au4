const Comment = require('./../models/comment');
const Post = require('./../models/post');
const catchAsync = require('./../utils/catchAsync');

exports.createComment = catchAsync(async (req, res, next) => {
    let { postcomment } = req.body;
    let { id } = req.params;
    let post = await Post.findOne({ _id: id });
    let comment = await Comment.create({ comment: postcomment });
    post.comment.push(comment._id);
    let postSaved = await post.save();
    res.status(201).json({
        status: 'success',
        data: {
            comment: comment,
            post: postSaved
        }
    });

});

exports.updateComment = catchAsync(async (req, res, next) => {
    let { id, postcomment } = req.body;
    let comment = await Comment.update({ _id: id }, { $set: { comment: postcomment } });
    res.status(201).json({
        status: 'success',
        data: {
            data: comment
        }
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    let { _id, postId } = req.body;
    let comment = await Comment.deleteOne({ _id });
    let post = await Post.findOne({ _id: postId });
    post.comment.splice(comment.indexOf(_id), 1)
    let postSaved = await post.save();
    res.status(201).json({
        status: 'success',
        data: {
            data: comment,
            postSaved
        }
    });
});