const express = require('express');
const cors = require('cors');

const loginRouter = require("./routes/loginRouter");
const tokenRouter = require("./routes/tokenRouter");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");

require("dotenv").config();
const connectToDatabase = require('./db/db');

const app = express();

app.use(cors());
app.use(express.json());
connectToDatabase();

app.use('/api', loginRouter);
app.use('/api', tokenRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', orderRouter);

app.listen(4000, () => {
  console.log("Server is running http://localhost:4000");
});

module.exports = app;