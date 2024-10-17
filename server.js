require("dotenv").config();
const express = require('express');
const db = require('./db');
const userRouter = require('./routes/user')

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)

app.listen(7070, () => {
  console.log('Server is running on port 7070');
});

