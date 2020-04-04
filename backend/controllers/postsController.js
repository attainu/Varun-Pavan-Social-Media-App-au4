const Post = require('./../models/post');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');

exports.createPost = catchAsync(async (req, res, next) => {
  let { dataType, data } = req.body;
  let { id } = req.params;
  let post = await Post.create({ dataType, data });
  let user = await User.findOne({ _id: id });
  user.posts.push(post._id);
  let userSaved = await user.save();
  res.status(201).json({
    status: 'success',
    data: {
      post: post,
      user: userSaved
    }
  });

});

exports.updatePost = catchAsync(async (req, res, next) => {
  let { userId, data, liked, commented } = req.body;
  let post = await Post.update({ userId }, { $set: { data, liked, commented } });
  res.status(201).json({
    status: 'success',
    data: {
      data: post
    }
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  let { _id } = req.body;
  let post = await Post.deleteOne({ _id });
  res.status(201).json({
    status: 'success',
    data: {
      data: post
    }
  });
});