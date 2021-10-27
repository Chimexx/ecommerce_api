const router = require("express").Router()

const Product = require("../models/Product")
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken")


//Create
router.post("/new", verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)

    } catch (error) {
        res.status(500).json(error)

    }

})

router.get("/find/:id", verifyToken, async (req, res) => {

    const product = await Product.findById(req.params.id)

    res.status(200).json(product)

    try {

    } catch (error) {
        res.status(500).json(error)

    }

})

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json(error)
    }
})

// //Delete
// router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id)

//         res.status(200).json('User deleted')

//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

// //Get a user
// router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         const { password, ...others } = user._doc

//         res.status(200).json(others)

//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

// //Get All Users
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//     const query = req.query.new

//     try {
//         const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()

//         res.status(200).json(users)

//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


// //get Users stats
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//     const date = new Date()

//     //gets today, one year ago
//     const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

//     try {

//         const data = await User.aggregate([
//             { $match: { createdAt: { $gte: lastYear } } },
//             { $project: { month: { $month: "$createdAt" }, }, },
//             { $group: { _id: "$month", total: { $sum: 1 }, }, },
//         ]);

//         res.status(200).json(data)

//     } catch (error) {

//         res.status(500).json(error)

//     }

// })


module.exports = router