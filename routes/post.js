const express = require('express')
const router = express.Router();
const postController = require("./../controllers/postsController");

router
    .route('/')
    .put(postController.updatePost)
    .delete(postController.deletePost)

router.put("/update", postController.updatePostImage);

router
    .route('/:id')
    .post(postController.createPost);

router.put('/like', postController.likePost)
router.put('/unlike', postController.unlikePost)

router.get('/sortedPosts/:id', postController.sortedPosts);


module.exports = router;
