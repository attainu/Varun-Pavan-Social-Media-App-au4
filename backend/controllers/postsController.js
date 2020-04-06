const Post = require('./../models/post');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');

/***
 * Function Purpose - Create a new post and save the ID of post in users posts field
 * URL - /posts/:id - /posts/{id of logged in user}
 * ***/
exports.createPost = catchAsync(async (req, res, next) => {
  let { dataType, data, userId } = req.body;
  let { id } = req.params;
  let post = await Post.create({ dataType, data, userId });
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

/***
 * Function Purpose - Get the sorted based on the pagination 1.Gets all the posts and send the posts based on the page
 * URL - /posts/:id - Id of the user
 * ***/

exports.sortedPosts = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  console.log(new Date())
  let posts = await User.findOne({ _id: id })
    .populate({
      path: 'following',
      select: 'posts',
      populate: {
        path: 'posts',
        select: 'data userId dateCreated',
        options: {
          limit: 10
        },
        match: {
          dateCreated: {
            $lte: new Date()
          }
        },
        populate: {
          path: 'userId',
          select: '_id name email'
        }
      }
    });
  posts = posts.following.reduce((acc, data) => [...acc, data.posts], []);
  posts = [].concat(...posts);
  posts.sort((posts1, posts2) => posts1.dateCreated > posts2.dateCreated ? -1 : 1);
  res.status(201).json({
    data: posts
  })
});