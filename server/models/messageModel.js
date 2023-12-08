import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Other message details like timestamps, read status, etc.
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;