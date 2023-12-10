import express from 'express'
const router = express.Router()
import { protect } from '../middleware/authMiddleware.js'

import {
    authUser,
    registerUser,
    getUserProfile,
    logoutUser,
    getUsers,
} from '../controllers/userController.js'

// Route to register a new user
router.route('/').post(registerUser)

// Route to authenticate and log in a user
router.post('/login', authUser)

// Route to get user profile
router.route('/profile').get(protect, getUserProfile)

// Route to logout
router.route('/logout').post(protect, logoutUser)

// Route to get all available users
router.route('/usernames').get(getUsers)

export default router


