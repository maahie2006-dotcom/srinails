import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true, // ✅ Automatically converts "Nitu@Gmail.com" to "nitu@gmail.com"
    trim: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  
  // ✅ Stores your response (e.g., "dm me on instagram")
  reply: { 
    type: String, 
    default: "" 
  },

  // ✅ For your Admin Red Dot
  seenByAdmin: { 
    type: Boolean, 
    default: false 
  },

  // ✅ For Customer Notifications
  isReadByUser: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });

// Add an index to make searching by email much faster
contactSchema.index({ email: 1 });

export default mongoose.model("Contact", contactSchema);