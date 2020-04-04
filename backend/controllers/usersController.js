const User = require('./../models/user');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const bcryptjs = require('bcryptjs')
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let user = await User.find({});
  res.json({
    data: user
  })
});

exports.createUser = catchAsync(async (req, res, next) => {
  let { name, email, phone, password, gender, location, bio } = req.body;

  //Encrypt password
  let salt = await bcryptjs.genSalt(10);
  let hashPassword = await bcryptjs.hash(password, salt)

  let user = await User.create({ name, email, phone, password: hashPassword, gender, location, bio });
  res.json({
    status: true,
    data: user
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  //Decrypt password
  let validPassword = await bcryptjs.compare(password, user.password)
  if (validPassword) {
    const token = jwt.sign({ _id: user._id }, 'secretkey')
    res.header('auth-token', token).json({
      status: true,
      data: user,
      token
    });
  } else {
    return next(new AppError('There is no user with email address.', 404));
  }
});


exports.addFollowerFollowing = catchAsync(async (req, res, next) => {
  let { id1, id2 } = req.params;

  const user = await User.findOne({ _id: id1 });
  if (user.following.includes(id2)) {
    return res.json({ message: `You are already following him.` });
  }
  user.following.push(id2);
  const savedUser = await user.save();

  const userFollower = await User.findOne({ _id: id2 });
  userFollower.followers.push(id1);
  const savedFollower = await userFollower.save();

  res.json({
    data: savedUser,
    data2: savedFollower
  });

});

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const followers = await User.findOne({ _id: id }).populate('followers', 'name');
  res.json({
    data: followers
  })
});

exports.getAllFollowing = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const following = await User.findOne({ _id: id }).populate('following', 'name');
  res.json({
    data: following
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const posts = await User.findOne({ _id: id }).populate('posts');
  res.json({
    data: posts
  })
});