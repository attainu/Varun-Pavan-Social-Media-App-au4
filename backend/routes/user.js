const express = require('express')
const router = express.Router();
const User = require('./../models/user')
//sign UP
router.post('/add', async (req, res) => {
    try {
        let { name, email, phone, password, gender, location, bio } = req.body;
        let user = await User.create({ name, email, phone, password, gender, location, bio });
        res.json({
            status: true,
            data: user
        })
    } catch (error) {
        res.send(error)
    }
})
// login
router.get('/one', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email, password });
        if (user) {
            res.json({
                status: true,
                data: user
            })
        } else {
            res.json({
                status: false,
                message: "User not found"
            })
        }
    } catch (error) {
        res.send(error)
    }
})
module.exports = router;