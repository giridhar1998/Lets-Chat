import Conversation from '../models/Conversation'
import Message from '../models/Message'
import authMiddleware from '../middleware/authMiddleware' // Auth middleware to verify JWT token


// Create a new conversation
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

// Get all conversations of a user
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

// Send a message in a conversation
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.userId; // Extracted from JWT token in authMiddleware

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
    newConversation,
    allConversation,
    sendMessage,
}