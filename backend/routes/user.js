const express = require('express')
const router = express.Router();
const usersController = require("./../controllers/usersController");
const auth = require('./verify');

router.post("/signup", usersController.createUser);
router.post("/login", usersController.loginUser);
// router.post("/login", usersController.loginUser);
router.post("/signup/find", usersController.getOneUser);
router.get("/user", usersController.getUserData);
router.post("/reset", usersController.resetPassword);
router.get("/", auth, usersController.getAllUsers);
router.get("/:id", auth, usersController.getUser);
router.get("/follow/:id1/:id2", auth, usersController.addFollowerFollowing);
router.get("/followers/:id", auth, usersController.getAllFollowers);
router.get("/following/:id", auth, usersController.getAllFollowing);
router.get("/posts/:id", auth, usersController.getAllPosts);
router.put("/unfollow/:id1/:id2", usersController.removeFollowerFollowing);
router.post("/follow/:id1/:id2", usersController.addFollowerFollowing);
router.put("/dp", auth, usersController.updateDP);
router.post("/update", auth, usersController.updateUser);

module.exports = router;