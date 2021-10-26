const User = require("../models/User")
const router = require("express").Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// dotenv.config()

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()

    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }

})

router.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({ username: req.body.username });

        if (!user) {

            res.status(401).json("Wrong credentials")
        }


        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {

            res.status(401).json("Wrong credentials")
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY, { expiresIn: "3d" })

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken })
    } catch (err) {

        // console.log(err)
    }

})

module.exports = router