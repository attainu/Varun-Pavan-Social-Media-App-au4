const express = require('express')
const router = express.Router();
const postController = require("./../controllers/postsController");

router
    .route('/')
    .put(postController.updatePost)
    .delete(postController.deletePost);

router
    .route('/:id')
    .post(postController.createPost)


module.exports = router;
