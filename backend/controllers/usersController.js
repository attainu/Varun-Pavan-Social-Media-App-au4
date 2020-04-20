const User = require('./../models/user');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const bcryptjs = require('bcryptjs')
const AppError = require('./../utils/appError');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const request = require('request');

cloudinary.config({
  cloud_name: 'dyhtwa8fn',
  api_key: '567213951287329',
  api_secret: 'aKDu7VbWNwVdVgp962-J4h4-PFY'
});

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


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

exports.getUserData = catchAsync(async (req, res, next) => {
  let { id } = req.query;
  let user = await User.findOne({ _id: id })
    .populate({
      path: "following followers posts",
      populate: {
        path: 'userId',
        select: 'name dateCreated'
      }
    });
  res.json({
    data: { user }
  })
});

/***
 * Function Purpose - To get a specific users posts
 * URL - /posts/:id - id of a user
 * ***/
exports.getPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let user = await User.findOne({ _id: id })
    .populate({
      path: 'posts',
      populate: {

      }
    })
});

/***
 * Function Purpose - To get a specific users
 * URL - /user/:id - id of a user
 * ***/
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let user = await User.findOne({ _id: id });
  if (user) {
    res.status(201).json({
      data: user
    });
  } else
    res.json(false)
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
  let validPassword = await bcryptjs.compare(password, user.password);
  validPassword = true;
  if (validPassword) {
    const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: "200s" })
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
  const followers = await User.findOne({ _id: id }).populate('follower', 'name');
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

function imageUpload(imgname, req, res) {

  cloudinary.uploader.upload(`${__dirname}/../public/images/${imgname}`, function (error, response) {
    let { userId, type } = req.body;
    console.log(response, userId);
    let user;
    if (type === 'cp')
      user = User.updateOne({ _id: userId }, { $set: { coverPic: response.secure_url } });
    else if (type === 'dp')
      user = User.updateOne({ _id: userId }, { $set: { profilePic: response.secure_url } });
    user.then(response => {
      res.send({
        status: 'success',
      });
    })
    user.catch(err => console.log(err));
    fs.unlinkSync(`${__dirname}/../public/images/${imgname}`);
  })
}

exports.updateDP = catchAsync(async (req, res, next) => {
  let { profilePic } = req.body;
  var base64Data = profilePic.replace(/^data:image\/jpeg;base64,/, "");
  var imgStamp = Date.now() + '.jpg';
  // console.log(base64Data);
  fs.writeFile(`${__dirname}/../public/images/${imgStamp}`, base64Data, 'base64', function (err) {
    if (err) {
      console.log(err);
    }
    imageUpload(imgStamp, req, res);
  });
});