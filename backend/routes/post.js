const Post = require('./../models/post');
const express = require('express')
const router = express.Router();
router.post('/add', async (req, res) => {
    try {
        let { userId, data, liked, commented } = req.body;
        let post = await Post.create({ userId, data, liked, commented });
        res.json(post)

    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router;