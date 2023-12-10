import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Other message details like timestamps, etc., can be added here
}, { timestamps: true });

const conversationSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [messageSchema],
  // Other conversation details
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
