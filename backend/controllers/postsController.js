const Post = require('./../models/post');
const catchAsync = require('./../utils/catchAsync');

exports.createPost = catchAsync(async (req, res, next) => {
  let { userId, data, liked, commented } = req.body;
  let post = await Post.create({ userId, data, liked, commented });
  res.status(201).json({
    status: 'success',
    data: {
      tour: post
    }
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  let { userId, data, liked, commented } = req.body;
  let post = await Post.update({ userId }, { $set: { data, liked, commented } });
  res.status(201).json({
    status: 'success',
    data: {
      tour: post
    }
  });
});