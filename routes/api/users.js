import express from 'express'
const router = express.Router()
const controller = require('../../controllers/Controller')

// @route GET api/users
// @desc Register User
// @access Public
router.get('/', (req, res) => res.send('user route'))

// @route post api/users/signup
// @desc  signup User
// @access Public
router.post('/signup', controller.userSignup)
router.post('/login', controller.userLogin)

// @route post api/users/:userEmail/getUser
// @desc  get user by email
// @access Public
router.get('/:userEmail/getUser', controller.getUserByEmail)

module.exports = router
