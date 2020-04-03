const express = require('express')
const router = express.Router();
const postController = require("./../controllers/postsController");

router
    .route('/')
    .post(postController.createPost)
    .put(postController.updatePost)


module.exports = router;

// router.post('/add', async (req, res) => {
//     console.log("Hey");
//     try {
//         let { userId, data, liked, commented } = req.body;
//         console.log(req.body);
//         let post = await Post.create({ userId, data, liked, commented });
//         res.json(post)

//     } catch (error) {
//         res.status(400).send(error)
//     }
// });

// router.put('/update', async (req, res) => {
//     try {
//         let { userId, data, liked, commented } = req.body;
//         let post = await Post.update({ userId }, { $set: { data, liked, commented } });
//         res.json(post)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// });