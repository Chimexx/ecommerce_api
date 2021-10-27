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

//Get A Product
router.get("/find/:id", async (req, res) => {

    const product = await Product.findById(req.params.id)

    res.status(200).json(product)

    try {

    } catch (error) {
        res.status(500).json(error)

    }

})

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json('Product deleted')

    } catch (error) {
        res.status(500).json(error)
    }
})



//Get All Products
router.get("/", async (req, res) => {
    const catQuery = req.query.category
    const newQuery = req.query.new
    console.log(catQuery, newQuery);

    try {

        let products;

        if (catQuery) {
            products = await Product.find({ category: { $in: [catQuery], } }).limit(10)

        }
        else if (newQuery) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        }
        else {
            products = await Product.find()
        }

        res.status(200).json(products)

    } catch (error) {
        res.status(500).json(error)
    }
})


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