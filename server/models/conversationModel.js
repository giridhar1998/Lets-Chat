import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isRequested: { 
    type: Boolean, 
    default: false 
  },
  // Other conversation details
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;