import express from 'express'
import {
    newConversation,
    allConversation,
    sendMessage,
} from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'// Auth middleware to verify JWT token
const router = express.Router()

router.route('/conversation').post(protect, newConversation)
router.route('/conversations').get(protect, allConversation)
router.route('/message').post(protect, sendMessage)


