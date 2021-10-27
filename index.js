const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const usersRoute = require("./routes/users")
const productRoute = require("./routes/product")

dotenv.config()
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('DB connection successful')
    })
    .catch((err) => {
        console.log(err)
    })

app.use(express.json())
app.use("/api/auth", authRoute)

app.use(express.json())
app.use("/api/users", usersRoute)

app.use(express.json())
app.use("/api/product", productRoute)

app.listen(5000, () => {
    console.log('Backend running')
})