import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  reply: String   // ✅ ADD THIS
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);