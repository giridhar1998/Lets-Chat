import Conversation from '../models/conversationModel.js'
import Invitation from '../models/invitationModel.js'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc    Send invitation to user for chat
// @route   POST /api/chat/send
const sendInvite = asyncHandler(async (req, res) => {
  try {
    const { recipientUsername } = req.body;
    const sender = req.user;
    const recipient = await User.findOne({ name: recipientUsername });

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

// @desc    Send invitation to user for chat
// @route   GET /api/chat/invitations
const getAllRequests = asyncHandler(async (req, res) => {
  try {
    const receiverId = req.userId;

    const invitations = await Invitation.find({
      $or: [{ senderId: receiverId }, { recipientId: receiverId }],
    });

    const modifiedInvitations = await Promise.all(
      invitations.map(async (invitation) => {
        const sender = await User.findById(invitation.senderId).select('name');
        const recipient = await User.findById(invitation.recipientId).select('name');

        return {
          invitationId: invitation._id,
          sender: {
            id: invitation.senderId,
            name: sender ? sender.name : 'Unknown Sender',
          },
          recipient: {
            id: invitation.recipientId,
            name: recipient ? recipient.name : 'Unknown Recipient',
          },
          status: invitation.status,
        };
      })
    );

    res.status(200).json(modifiedInvitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Lets user to accept the invitation
// @route   POST /api/chat/accept
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

// @desc    Lets user to reject invitation
// @route   POST /api/chat/reject
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

// @desc    API to send message to a user
// @route   POST /api/chat/message
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const senderId = req.userId;
    const { recipientUsername, text } = req.body;

    const recipient = await User.findOne({ name: recipientUsername });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const senderInvitation = await Invitation.findOne({
      senderId: senderId,
      recipientId: recipient._id,
      status: 'accepted',
    });

    const recipientInvitation = await Invitation.findOne({
      senderId: recipient._id,
      recipientId: senderId,
      status: 'accepted',
    });

    if (!senderInvitation && !recipientInvitation) {
      return res.status(400).json({ message: 'Invite not accepted yet or rejected' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipient._id] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, recipient._id], messages: [] });
    }

    const newMessage = {
      sender: senderId,
      text: text,
      createdAt: new Date(),
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    API to get all the one on one conversations
// @route   GET /api/chat/conversations
const getConversations = asyncHandler(async (req, res) => {
  try {
    const sender = req.userId; 
    const { recipientUsername } = req.body;

    const recipient = await User.findOne({ name: recipientUsername });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const receiver = recipient._id;

    const conversations = await Conversation.find({
      participants: { $all: [sender, receiver] },
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



