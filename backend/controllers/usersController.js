const User = require('./../models/user');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync');
const bcryptjs = require('bcryptjs')

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
    res.json({
      status: false,
      message: "User not found"
    });
  }
});