const express = require('express')
const router = express.Router();
const User = require('./../models/user')
const jwt = require('jsonwebtoken')
//sign UP
router.post('/signup', async (req, res) => {
    try {
        let { name, email, phone, password, gender, location, bio } = req.body;
        let user = await User.create({ name, email, phone, password, gender, location, bio });
        res.json({
            status: true,
            data: user
        })
    } catch (error) {
        res.status(400).send(error)

    }
})
// login
router.get('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ _id: user._id }, 'secretkey')
            res.header('auth-token', token).json({
                status: true,
                data: user,
                token
            })
        } else {
            res.json({
                status: false,
                message: "User not found"
            })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router;