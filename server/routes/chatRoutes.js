import express from 'express'
const router = express.Router()
import {
    sendRequest,
    newConversation,
    allConversation,
    sendMessage,
} from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

// Routes for managing conversations

// Send chat request to a user
router.post('/sendRequest', protect, sendRequest);

// Create a new conversation
router.post('/conversation', protect, newConversation);

// Get all conversations of a user
router.get('/conversations', protect, allConversation);

// Send a message in a conversation
router.post('/message', protect, sendMessage);

export default router;


