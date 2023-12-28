const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
// Parse JSON bodies
server.use(express.json());

server.use(cors());
//set up mongoose
const mongoose = require("mongoose");
const mongoDb = process.env.DATABASE_STRING;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const userRouter = require('./routes/userRouter');

server.use('/user', userRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
