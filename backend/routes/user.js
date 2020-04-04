const express = require('express')
const router = express.Router();
const usersController = require("./../controllers/usersController");

router.post("/signup", usersController.createUser);
router.post("/login", usersController.loginUser);
router.post("/:id1/:id2", usersController.addFollowerFollowing);
router.get("/", usersController.getAllUsers);
router.get("/followers/:id", usersController.getAllFollowers);
router.get("/following/:id", usersController.getAllFollowing);
router.get("/posts/:id", usersController.getAllPosts);

module.exports = router;