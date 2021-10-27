const router = require("express").Router()

const Cart = require("../models/Cart")
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken")


//Create Cart
router.post("/new", verifyToken, async (req, res) => {

    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(201).json(savedCart)

    } catch (error) {
        res.status(500).json(error)

    }

})

//Get User Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {

    const cart = await Cart.findOne({ userId: req.params.userId })

    res.status(200).json(cart)

    try {

    } catch (error) {
        res.status(500).json(error)

    }

})

//Update Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        res.status(200).json(updatedCart)

    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)

        res.status(200).json('Cart deleted')

    } catch (error) {
        res.status(500).json(error)
    }
})



//Get All Carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {


    try {
        const carts = await Cart.find()

        res.status(200).json(carts)

    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router