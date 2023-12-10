import Conversation from '../models/conversationModel.js'
import Invitation from '../models/invitationModel.js'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const sendInvite = asyncHandler(async (req, res) => {
  try {
    const { recipientUsername } = req.body;
    const sender = req.user;
    const recipient = await User.findOne({ name: recipientUsername });
    console.log("recepient : ", recipient);

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'Sender or recipient not found' });
    }

    const existingInvite = await Invitation.findOne({ senderId: sender._id, recipientId: recipient._id });
    console.log(existingInvite);

    if (existingInvite) {
      return res.status(400).json({ message: 'Invite already sent' });
    }

    const invitation = new Invitation({ senderId: sender._id, recipientId: recipient._id });
    console.log(invitation);
    await invitation.save();

    res.status(201).json({ message: 'Invite sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const getAllRequests = asyncHandler(async (req, res) => {
  try {
    const receiver = req.userId;
    const invitations = await Invitation.find({ $or: [{ senderId: receiver }, { recipientId: receiver }] });

    res.status(200).json(invitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
})

const acceptInvite = asyncHandler(async (req, res) => {
  try {

    const { invitationId } = req.body;
    const invitation = await Invitation.findById(invitationId);

    console.log("inviation : ", invitation);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    invitation.status = 'accepted';
    await invitation.save();

    res.status(200).json({ message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const rejectInvite = asyncHandler(async (req, res) => {
  try {
    const { invitationId } = req.body;
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    invitation.status = 'rejected';
    await invitation.save();

    res.status(200).json({ message: 'Invitation rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const senderId = req.userId;
    const { recipientUsername, text } = req.body;

    // Find the recipient user
    const recipient = await User.findOne({ name: recipientUsername });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    const recipientId = recipient._id;

    // Check if there's an accepted invitation between sender and recipient
    const invitation = await Invitation.findOne({
      senderId,
      recipientId,
      status: 'accepted',
    });
    if (!invitation) {
      return res.status(400).json({ message: 'Invite not accepted yet or rejected' });
    }

    // Find or create a conversation between sender and recipient
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, recipientId], messages: [] });
    }

    // Create a new message
    const newMessage = {
      sender: senderId,
      text: text,
      createdAt: new Date(), // You can adjust this timestamp as needed
    };

    // Add the message to the conversation and save it
    conversation.messages.push(newMessage);
    await conversation.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


const getConversations = asyncHandler(async (req, res) => {
  try {
    const userId1 = req.userId;
    const { recipientUsername } = req.body;
    const recipient = await User.findOne({ name: recipientUsername });
    console.log("recipient: ", recipient);

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    const userId2 = recipient._id;

    console.log("userId1 :", userId1)
    console.log("userId2 : ", userId2)

    const conversations = await Conversation.find({
      participants: { $all: [userId1, userId2] },
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});  

export {
  sendInvite,
  getAllRequests,
  acceptInvite,
  rejectInvite,
  sendMessage,
  getConversations,
};



