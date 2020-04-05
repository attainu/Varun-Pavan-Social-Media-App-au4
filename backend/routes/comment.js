const express = require('express')
const router = express.Router();
const commentController = require("./../controllers/commentController");

router
    .route('/')
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

router
    .route('/:id')
    .post(commentController.createComment)


module.exports = router;