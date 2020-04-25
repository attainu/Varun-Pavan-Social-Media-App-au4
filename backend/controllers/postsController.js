const Post = require('./../models/post');
const User = require('./../models/user');
const Comment = require('./../models/comment');
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
  let post = await Post.updateOne({ userId }, { $set: { data, liked, commented } });
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
  let comment = await Comment.deleteMany({ postId: _id })
  res.status(201).json({
    status: 'success',
    data: {
      data: post,
      comment
    }
  });
});

/***
 * Function Purpose - Get the sorted based on the pagination 1.Gets all the posts and send the posts based on the page
 * URL - /posts/:id - Id of the user
 * ***/

/**
 * exports.sortedPosts = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  console.log(new Date())
  let posts = await User.findOne({ _id: id })
    .populate({
      path: 'following',
      select: 'posts',
      populate: {
        path: 'posts',
        select: 'data userId dateCreated liked commentsId',
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
 */

exports.sortedPosts = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  // console.log(new Date())
  let posts = await User.findOne({ _id: id })
    .populate({
      path: 'following',
      select: 'posts',
      populate: {
        path: 'posts',
        select: 'data userId dateCreated liked commentsId',
        options: {
          limit: 10
        },
        match: {
          dateCreated: {
            $lte: new Date()
          }
        },
        populate: {
          path: 'userId commentsId liked',
          select: '_id name email profilePic comment commentCreated',
          populate: {
            path: "userId",
            select: "_id name profilePic"
          }
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

/***
 * Function Purpose - Like a post and update the user and post models
 * URL - /posts/like (put) - {
"postId":"id of the post to be liked",
"userId":"id of the user liking the post"
}
 * ***/
exports.likePost = catchAsync(async (req, res) => {
  let { postId, userId } = req.body
  let post = await Post.findOne({ _id: postId });
  if (post.liked.includes(userId)) {
    return res.status(401).json({
      status: false,
      msg: "Post already liked"
    })
  }
  let user = await User.findOne({ _id: userId });
  post.liked.push(userId);
  user.likedPosts.push(postId);
  let userSaved = await user.save();
  let postSaved = await post.save();
  return res.status(200).json({
    status: true,
    msg: "post Liked",
    post: postSaved,
    User: userSaved
  })
})

/***
 * Function Purpose - Unlike a post and update the user and post models
 * URL - /posts/unlike (put) - {
"postId":"id of the post to be unliked",
"userId":"id of the user unliking the post"
}
 * ***/

exports.unlikePost = catchAsync(async (req, res) => {
  let { userId, postId } = req.body;
  let post = await Post.findById(postId);
  if (post.liked.includes(userId)) {
    let user = await User.findById(userId);
    user.likedPosts.splice(user.likedPosts.indexOf(postId), 1)
    post.liked.splice(post.liked.indexOf(userId), 1);
    let userSaved = await user.save();
    let postSaved = await post.save()
    return res.status(200).json({
      status: true,
      msg: "Post  Unliked",
      post: postSaved,
      user: userSaved
    })
  }
  return res.status(400).json({
    status: false,
    msg: "post alreday unliked"
  })
})