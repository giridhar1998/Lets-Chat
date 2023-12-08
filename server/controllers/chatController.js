import Conversation from '../models/conversationModel.js'
import Message from '../models/messageModel.js'
import asyncHandler from 'express-async-handler'

// @desc    Sending invite to user
// @route   POST /api/chat/sendRequest
const sendRequest = asyncHandler(async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.userId; // Extracted from JWT token in authMiddleware

    // Check if the 'toUser' exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there's an existing conversation with these users
    const existingConversation = await Conversation.findOne({
      participants: { $all: [fromUserId, toUserId] },
    });

    if (existingConversation) {
      return res.status(400).json({ message: 'Conversation already exists' });
    }

    // Send a chat request by creating a placeholder conversation
    const newConversation = new Conversation({ participants: [fromUserId, toUserId], isRequested: true });
    await newConversation.save();

    res.status(201).json({ message: 'Chat request sent successfully', conversation: newConversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new conversation
// @route   POST /api/chat//conversation
const newConversation = asyncHandler(async (req, res) => {
  try {
    const { participants } = req.body;

    // Check if conversation with the same participants already exists
    const existingConversation = await Conversation.findOne({ participants });
    if (existingConversation) {
      return res.status(400).json({ message: 'Conversation already exists' });
    }

    // Create a new conversation
    const newConversation = new Conversation({ participants });
    await newConversation.save();

    res.status(201).json({ message: 'Conversation created successfully', conversation: newConversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all conversations of a user
// @route   GET /api/chat//conversations
const allConversation = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId; // Extracted from JWT token in authMiddleware

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({ participants: userId }).populate('participants', 'username');

    res.status(200).json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Send message in a conversation
// @route   POST /api/chat/message
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.userId; // Extracted from JWT token in authMiddleware

    // Check if the conversation exists and is requested
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.isRequested) {
      return res.status(400).json({ message: 'Invite not accepted yet' });
    }

    // Check if the sender is part of the conversation
    if (!conversation.participants.includes(sender)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create a new message
    const newMessage = new Message({ conversationId, sender, text });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


export {
    sendRequest,
    newConversation,
    allConversation,
    sendMessage,
}