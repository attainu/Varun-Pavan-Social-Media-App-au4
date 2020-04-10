const User = require('./../models/user');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const bcryptjs = require('bcryptjs')
const AppError = require('./../utils/appError');

/***
 * Function Purpose - To get all users
 * URL - /users
 * ***/
exports.getAllUsers = catchAsync(async (req, res, next) => {
  let user = await User.find({});
  res.json({
    data: user
  })
});

/***
 * Function Purpose - To get a specific users
 * URL - /user/:id - id of a user
 * ***/
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  let user = await User.findOne({ _id: id });
  res.status(201).json({
    data: user
  })
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.json(true)
  return res.json(false)
});

/***
 * Function Purpose - Create a new user and save in the database
 * URL - /users/signup
 * req.body - { name, email, phone, password, gender, location }
 * ***/

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

/***
 * Function Purpose - Login user if the user already signedUp
 * URL - /users
 * req.body - { email, password }
 * ***/

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
    // return next(new AppError('There is no user with email address.', 404));
    res.json({ status: false })
  }
});

/***
 * Fucntion Purpose - When a user clicks on follow button, then respective users followers and following are updated
 * URL - /users/:id1/:id2 - /users/{User who is logged in}/{ID of following users}
 * ***/
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


/***
 * Function Purpose - Get all followers of a user
 * URL - users/:id1 - users/{ ID of logged in user} 
 * ***/
exports.getAllFollowers = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const followers = await User.findOne({ _id: id }).populate('followers', 'name');
  res.json({
    data: followers
  })
});

/***
 * Function Purpose - Get the list of following users
 * URL - users/:id1 - users/{ ID of logged in user} 
 * ***/
exports.getAllFollowing = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const following = await User.findOne({ _id: id }).populate('following', 'name');
  res.json({
    data: following
  });
});


/***
 * Function Purpose - Get all posts of loged in user
 * URL - users/:id1 - users/{ ID of logged in user}
 * ***/
exports.getAllPosts = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const posts = await User.findOne({ _id: id }).populate('posts');
  res.json({
    data: posts
  })
});

/***
 *  Function Purpose - When a user clicks on unfollow this function runs
 *  URL - /users/unfollow/:id1/:id2
 * ***/
exports.removeFollowerFollowing = catchAsync(async (req, res, next) => {
  let { id1, id2 } = req.params;

  const removeFollowing = await User.findOne({ _id: id1 });
  let index = removeFollowing.following.indexOf(id2)
  if (index === -1) {
    res.status(204).json({
      message: `Error! You aren't following this person.`
    });
  } else
    removeFollowing.following.splice(index, 1);
  const saveUser = await removeFollowing.save();

  const removeFollower = await User.findOne({ _id: id2 });
  index = removeFollower.followers.indexOf(id1);
  if (index === -1) {
    res.status(204).json({
      message: `Error! While updaing followers`
    });
  } else
    removeFollower.followers.splice(index, 1);
  const saveUserFollower = await removeFollower.save();

  res.status(201).json({
    message: `Followers and following count is updated accordingly.`,
    data: {
      following: saveUser,
      follower: saveUserFollower
    }
  })
});