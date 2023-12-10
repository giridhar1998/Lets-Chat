import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
}
);

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;