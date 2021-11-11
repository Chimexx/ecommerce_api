const router = require("express").Router();

const Order = require("../models/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

//Create Order
router.post("/new", verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		res.status(201).json(savedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get User Orders
router.get("/find/:userId", verifyToken, async (req, res) => {
	try {
		const order = await Order.findOne({ userId: req.params.userId });

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

//Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);

		res.status(200).json("Order deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

//Get All Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();

		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json(error);
	}
});

//get order stats

//Get Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
	const productId = req.query.pid;
	console.log(productId);
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: previousMonth },
					...(productId && {
						products: { $elemMatch: { productId } },
					}),
				},
			},
			{ $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
			{ $group: { _id: "$month", total: { $sum: "$sales" } } },
		]);
		res.status(200).json(income);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
