const express = require('express')
const userRouter = express.Router()
const {signup, signin, updateUser, logout} = require('../controller/userController.js')
const { isAuthenticated } = require('../controller/authController.js')

userRouter.post('/signup', signup)
userRouter.post('/login', signin)
userRouter.patch('/update',isAuthenticated ,updateUser)
userRouter.get('/logout', logout)
module.exports = userRouter 
