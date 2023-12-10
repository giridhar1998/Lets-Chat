import express from 'express'
const router = express.Router()
import {
    sendInvite,
    getAllRequests,
    acceptInvite,
    rejectInvite,
    sendMessage,
    getConversations,
  } from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

// Routes for managing conversations

// Send chat request to a user
router.route('/send').post(protect, sendInvite)

// Get all requests sent and received
router.route('/invitations').get(protect, getAllRequests)

// accepting the invitation from user
router.route('/accept').post(acceptInvite)

// rejecting invitation from user
router.route('/reject').post(rejectInvite)

// Send a message in a conversation
router.route('/message').post(protect, sendMessage)

// Get all conversations between users
router.route('/conversations').get(protect, getConversations)

export default router;


