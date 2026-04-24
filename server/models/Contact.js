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
    lowercase: true, 
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
  
  
  reply: { 
    type: String, 
    default: "" 
  },

 
  seenByAdmin: { 
    type: Boolean, 
    default: false 
  },

  
  isReadByUser: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });


contactSchema.index({ email: 1 });

export default mongoose.model("Contact", contactSchema);